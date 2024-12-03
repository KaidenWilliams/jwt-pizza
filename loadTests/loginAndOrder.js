import { sleep, check, group, fail } from "k6";
import http from "k6/http";

export const options = {
  cloud: {
    distribution: { "amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 100 } },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: "ramping-vus",
      gracefulStop: "30s",
      stages: [
        { target: 10, duration: "20s" },
        { target: 10, duration: "30s" },
        { target: 0, duration: "20s" },
      ],
      gracefulRampDown: "30s",
      exec: "scenario_1",
    },
  },
};

export function scenario_1() {
  let response;
  let authToken;
  let orderResponse;

  group("Pizza Order Flow", function () {
    response = http.put(
      "https://pizza-service.kaidenwilliams.com/api/auth",
      '{"email":"kwill@byu.edu","password":"12345"}',
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          origin: "https://pizza.kaidenwilliams.com",
          priority: "u=1, i",
          "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
      }
    );

    if (!check(response, { "status equals 200": (r) => r.status === 200 })) {
      fail("Authentication failed");
    }
    sleep(3.1);

    response = http.get("https://pizza-service.kaidenwilliams.com/api/order/menu", {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "if-none-match": 'W/"71-IwJV4iWSSt63Nw3GT8mFvwCNwGg"',
        origin: "https://pizza.kaidenwilliams.com",
        priority: "u=1, i",
        "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
    });

    response = http.get("https://pizza-service.kaidenwilliams.com/api/franchise", {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "if-none-match": 'W/"44-qM1a9c7oKj98U3Q0lrmHlRGFK2c"',
        origin: "https://pizza.kaidenwilliams.com",
        priority: "u=1, i",
        "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
    });
    sleep(8);

    orderResponse = http.post(
      "https://pizza-service.kaidenwilliams.com/api/order",
      '{"items":[{"menuId":1,"description":"Student","price":0.0001}],"storeId":"1","franchiseId":1}',
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          origin: "https://pizza.kaidenwilliams.com",
          priority: "u=1, i",
          "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
      }
    );

    if (!check(orderResponse, { "status equals 200": (r) => r.status === 200 })) {
      fail("Order creation failed");
    }
    sleep(3.6);

    let orderBody = JSON.parse(JSON.stringify(orderResponse.body));
    authToken = orderBody.jwt;

    response = http.post(
      "https://pizza-factory.cs329.click/api/order/verify",
      JSON.stringify({ jwt: authToken }),
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          origin: "https://pizza.kaidenwilliams.com",
          priority: "u=1, i",
          "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
        },
      }
    );

    if (!check(response, { "status equals 200": (r) => r.status === 200 })) {
      fail("Order verification failed");
    }
  });
}
