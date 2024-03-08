# ▶️ API Documentation

This repository contains APIs for user authentication.

## hosted url : https://banao-assignment.onrender.com
⚠️Note: As the Node.js server is deployed on a Render hosting service, utilizing a free service plan, it is subject to inactivity periods. During prolonged inactivity, the server may become inactive and require a restart upon hitting an API endpoint. Consequently, the initial response time upon accessing the API for the first time may be extended, potentially up to 30 seconds, as the server undergoes the restart process on Render's platform. Your patience and understanding during this initialization period are greatly appreciated

## /auth/createuser

This endpoint is used to create a new user.

### Request Body

```json
{
    "name": "YOUR_NAME",
    "email": "YOUR_EMAIL",
    "password": "YOUR_PASSWORD"
}
```````
## /auth/login

This endpoint is used to log in an existing user.

### Request Body

```json
{
    "email": "YOUR_EMAIL",
    "password": "YOUR_PASSWORD"
}
```````

## /auth/forgot-password

This endpoint is used to initiate the password reset process.

### Request Body

```json
{
    "email": "EXISTING_EMAIL_FOR_PASSWORD_RESET"
}
``````

## /auth/reset-password/:id/:token

This endpoint is used to reset the password for a user after they have initiated the password reset process.

### Request Body

```json
{
    "password": "NEW_PASSWORD"
}
```````
## ⚠️ Password Reset Email

After initiating the password reset process using the `/auth/forgot-password` endpoint and providing the email address, a password reset email is sent to the user's inbox. The email contains a unique link with an ID and token embedded in it. 

When the user clicks on the reset link in the email, it redirects them to a page where they can set a new password. Upon submitting the new password, the `/auth/reset-password/:id/:token` endpoint is invoked with the provided ID and token, along with the new password in the request body.

This process ensures secure password reset and authentication before updating the user's password.
