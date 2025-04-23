# Authentication API Documentation

## Overview
This API provides endpoints for user authentication, registration, password management, and user retrieval. All endpoints are prefixed with `/auth`.

## Base URL
`https://api.example.com/auth`

## Endpoints

### 1. Register a New User
- **URL**: `/auth/register`
- **Method**: POST
- **Description**: Registers a new user with the provided details.
- **Parameters**:
  - Body (JSON):
    - `name` (string, required): Full name of the user.
    - `email` (string, required): Valid email address.
    - `password` (string, required): User password.
    - `userType` (string, required): Type of user (`student` or `guardian`).
- **Headers**:
  - `Content-Type`: application/json
- **Response**:
  - **201 Created**:
    ```json
    { "message": "User registered" }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Please provide all required fields: email, name, password, and userType." }
    ```
    ```json
    { "message": "Invalid email address." }
    ```
    ```json
    { "message": "Invalid userType." }
    ```
    ```json
    { "error": "Email already registered" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal Server Error" }
    ```
- **Example Request**:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"secure123","userType":"student"}' "https://api.example.com/auth/register"
  ```

### 2. User Login
- **URL**: `/auth/login`
- **Method**: POST
- **Description**: Authenticates a user and returns a JWT token.
- **Parameters**:
  - Body (JSON):
    - `email` (string, required): User’s email address.
    - `password` (string, required): User’s password.
- **Headers**:
  - `Content-Type`: application/json
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Login successful.",
      "token": "<JWT_TOKEN>",
      "user": {
        "id": "<USER_ID>",
        "email": "john@example.com",
        "name": "John Doe",
        "userType": "student"
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Email and password are required." }
    ```
    ```json
    { "message": "Invalid email format." }
    ```
  - **401 Unauthorized**:
    ```json
    { "message": "Invalid credentials." }
    ```
  - **404 Not Found**:
    ```json
    { "message": "User not found." }
    ```
  - **500 Internal Server Error**:
    ```json
    { "message": "Server error, please try again later." }
    ```
- **Example Request**:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"secure123"}' "https://api.example.com/auth/login"
  ```

### 3. Send Password Reset Email
- **URL**: `/auth/sendMail`
- **Method**: POST
- **Description**: Sends a password reset email with a temporary link to the user.
- **Parameters**:
  - Body (JSON):
    - `email` (string, required): User’s email address.
- **Headers**:
  - `Content-Type`: application/json
- **Response**:
  - **200 OK**:
    ```json
    { "message": "Reset password email sent successfully." }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Please provide your email address." }
    ```
    ```json
    { "message": "Invalid email format." }
    ```
  - **404 Not Found**:
    ```json
    { "message": "User not found." }
    ```
  - **500 Internal Server Error**:
    ```json
    { "message": "Failed to send reset password email." }
    ```
- **Example Request**:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"email":"john@example.com"}' "https://api.example.com/auth/sendMail"
  ```

### 4. Reset Password
- **URL**: `/auth/resetPassword`
- **Method**: POST
- **Description**: Resets the user’s password using a valid reset token.
- **Parameters**:
  - Body (JSON):
    - `token` (string, required): JWT token from the reset email.
    - `newPassword` (string, required): New password for the user.
- **Headers**:
  - `Content-Type`: application/json
- **Response**:
  - **200 OK**:
    ```json
    { "message": "Password updated successfully." }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Please provide a token and new password." }
    ```
  - **401 Unauthorized**:
    ```json
    { "message": "Invalid or expired token." }
    ```
  - **404 Not Found**:
    ```json
    { "message": "User not found." }
    ```
  - **500 Internal Server Error**:
    ```json
    { "message": "Server error, please try again later." }
    ```
- **Example Request**:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"token":"eyJhb...","newPassword":"newSecure123"}' "https://api.example.com/auth/resetPassword"
  ```

### 5. Get User by ID
- **URL**: `/auth/getUserById/:id`
- **Method**: GET
- **Description**: Retrieves user details by their ID, including associated student or guardian data.
- **Parameters**:
  - Path:
    - `id` (string, required): MongoDB ObjectID of the user (24-character hexadecimal).
- **Headers**:
  - `Authorization`: Bearer `<JWT_TOKEN>` (required)
- **Response**:
  - **200 OK**:
    ```json
    {
      "_id": "<USER_ID>",
      "name": "John Doe",
      "email": "john@example.com",
      "userType": "student",
      "student": { /* Populated student data */ },
      "guardian": { /* Populated guardian data */ }
    }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Invalid user ID format." }
    ```
  - **404 Not Found**:
    ```json
    { "message": "User not found." }
    ```
  - **500 Internal Server Error**:
    ```json
    { "message": "Server error." }
    ```
- **Example Request**:
  ```bash
  curl -H "Authorization: Bearer <JWT_TOKEN>" "https://api.example.com/auth/getUserById/507f1f77bcf86cd799439011"
  ```

## Authentication
- The `/auth/getUserById/:id` endpoint requires a valid JWT token in the `Authorization` header as `Bearer <token>`.
- Tokens are obtained via the `/auth/login` endpoint and are valid for 3 days.
- Other endpoints (`/auth/register`, `/auth/login`, `/auth/sendMail`, `/auth/resetPassword`) do not require authentication.

## Rate Limiting
- **General Limiter**: Applied to `/auth/register`, `/auth/sendMail`, and `/auth/getUserById/:id` to prevent abuse.
- **Login Limiter**: Applied to `/auth/login` to restrict login attempts.
- **Reset Limiter**: Applied to `/auth/resetPassword` to limit password reset requests.

## Error Handling
- **400 Bad Request**: Invalid or missing parameters.
- **401 Unauthorized**: Invalid credentials or token.
- **404 Not Found**: Resource (e.g., user) not found.
- **500 Internal Server Error**: Unexpected server issues.

## Notes
- Email addresses are normalized using the `validator` library to ensure consistency.
- Passwords are hashed using `bcrypt` with a salt round of 10.
- Reset tokens are valid for 10 minutes and included in the reset email link.
- The `FRONTEND_URL` environment variable is used to construct reset password links.
