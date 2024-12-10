
# Curiosity Report: Authentication

## What is Authentication:
Authentication: The process of verifying the identity of a user, system, or device to ensure that the entity attempting to access a system is who they claim to be.
•	Answers the Question: "Who are you?"

## Authentication vs Authorization:
Two related, but different concepts.
Authentication: Establishes the identity of an entity.
Authorization: Determines what an authenticated user is allowed to do.
•	In AWS, Authentication is done through IAM Users, Roles, or Groups. As far as AWS is concerned, the User / Role / Group an entity has is who an entity is. Authorization is done through the actual Permissions attached to those Users, Roles, or Groups. These permissions determine what an entity is allowed to do.

## Authorization Methods:
### 1. Simple Passwords
   
Description: 

•	Every time a user attempts to access a resource, they must enter in some sort of credential that only they uniquely know / have access to that proves their identity

•	Example: Every single time you want to access your bonds on TreasuryDirect, it is necessary to enter your Account Number, and a password that proves your identity. This password is never cached anywhere, it must be entered every single time you want to access the website.


Drawbacks:

• Annoying for the user, creates friction every time they want to access a website or resource.

•	Passwords can easily be forgotten or stolen

•	Vulnerable to attacks such as brute force, phishing, or credential stuffing.


### 2. Session-Based Authentication:

Description:

•	After a user logs in, the server creates a session (some unique identifier) and stores it on the server.

•	The session ID is sent to back to the user's browser and stored as a cookie (a Key-Value Pair stored in the browser), which is included in subsequent requests to verify the user's identity WITHOUT them having to enter their password again.

•	Addresses pain point of User having to log in every time they want to access your website.

![image](https://github.com/user-attachments/assets/a009d9a3-b2ce-466a-a2ee-a550575efb23)


Credit: Fireship Youtube



Drawbacks:

•	Has to be stored somehow on a Centralized Server, which becomes difficult for large distributed systems.

•	Vulnerable to session hijacking or cross-site scripting (XSS) attacks, in which a bad actor steals a Users session ID and uses it to perform requests for them. This can be mitigated somewhat by putting an expiration time on a session which, after that, a User is required to login again.

•	Users can still easily forget their passwords, and passwords can be stolen.

### 3A. Token-Based Authentication:
Description:

•	After a user logs in, the server creates a JWT (JSON Web Token). A JWT consists of a header (Metadata, hashing algorithm, fact that it is a JWT), a Payload (contains claims, which are information about the User, such as who they are, what their role is, what their permissions are, and the expiration time for the token), and a signature (hash of the header and payload, done with a private key stored on the server)

•	This JWT is then sent to the User, who stores it as a cookie. On all future requests the client will send the JWT to the server, in the format: Authorization: Bearer <token>. 

•	The server then verifies the JWT is valid by hashing the header and payload sent in the JWT again according to the hashing algorithm in the header, comparing it to the signature of the JWT, and ensuring they are the same.

•	This fixes the pain point of having to store many sessions on the server. With token-based authentication, the server just needs to store a Private key. The browser stores all the needed information instead.  

Drawbacks:

•	Still vulnerable to session hijacking or cross-site scripting (XSS) attacks, but this time a bad actor can steal a User’s JWT. Can still be mitigated somewhat by putting an expiration time on a session which, after that, a User is required to login again.
•	Users can still easily forget their passwords, and passwords can be stolen.

### 3B. Token-Based Authentication with Refresh Tokens

Description:

•	Token-based authentication solves the pain point of requiring server-side session storage, but there is still a drawback of token expiration. For security reasons, the token has to be expired frequently, and it is burdensome for a User to frequently log back in. 

•	Customers still had to deal with annoyance of periodically having to log back in every time their JWT expired. To fix that, Refresh Tokens were introduced as a concept.

•	After a user logs in, the server generates TWO tokens:
1.	An access token (short-lived, often valid for minutes to hours).
2.	A refresh token (long-lived, valid for days or weeks).
   
•	Both tokens are sent to the client. The access token is used for immediate requests to the server, while the refresh token is securely stored and used only when the access token expires.

•	When the access token expires, the client sends the refresh token to the server to request a new access token. If the refresh token is valid, the server generates a new access token and sends it back to the client.

Drawbacks:

•	People can still forget or lose their passwords.



### 4. Password-less Authentication:

Description

•	Instead of using a text-based password you enter, systems can use other forms of Authentication. Examples of these are Face Id, or Touch Id.

### 5. Continuous Authentication:

Description

•	Behavior-based monitoring used along with other forms of authentication to ensure a user remains authenticated throughout a session. For example, the Captcha “I human” button. The actual button press does not do anything, but your activity before that is tracked.
