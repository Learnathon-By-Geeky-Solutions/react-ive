# Profile API Documentation

## Overview
This API provides endpoints for managing user profiles, including updating profile details and retrieving user information. All endpoints are prefixed with `/profile`.

## Base URL
`https://api.example.com/profile`

## Endpoints

### 1. Update User Profile
- **URL**: `/profile/updateProfile/:userId`
- **Method**: PUT
- **Description**: Updates the profile of a specified user, allowing partial updates to fields such as name, email, password, and subjects. Subjects are upserted into the `Subjects` collection.
- **Parameters**:
  - Path:
    - `userId` (string, required): MongoDB ObjectID of the user (24-character hexadecimal).
  - Body (JSON, all fields optional):
    - `name` (string): Full name of the user.
    - `email` (string): Email address of the user.
    - `password` (string): New password for the user.
    - `userType` (string): Type of user (e.g., "student", "guardian").
    - `gender` (string): Gender of the user.
    - `session` (string): Academic session (e.g., "2023-2024").
    - `department` (string): Academic department (e.g., "Computer Science").
    - `studyingSubject` (string): Subject currently being studied.
    - `subjects` (array of strings): List of subject names (e.g., ["Mathematics", "Science"]).
- **Headers**:
  - `Content-Type`: application/json
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Profile updated successfully",
      "user": {
        "_id": "<USER_ID>",
        "name": "John Doe",
        "email": "john@example.com",
        "userType": "student",
        "gender": "Male",
        "session": "2023-2024",
        "department": "Computer Science",
        "studyingSubject": "Mathematics",
        "subjects": [
          { "_id": "<SUBJECT_ID>", "name": "Mathematics" },
          { "_id": "<SUBJECT_ID>", "name": "Science" }
        ],
        "createdAt": "2025-04-23T12:00:00Z",
        "updatedAt": "2025-04-23T12:00:00Z"
      }
    }
    ```
  - **404 Not Found**:
    ```json
    { "message": "User not found" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "message": "Internal server error" }
    ```
- **Example Request**:
  ```bash
  curl -X PUT -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","subjects":["Mathematics","Science"]}' "https://api.example.com/profile/updateProfile/507f1f77bcf86cd799439011"
  ```

### 2. Get User Profile
- **URL**: `/profile/getUser/:userId`
- **Method**: GET
- **Description**: Retrieves the profile details of a specified user, including populated subject details.
- **Parameters**:
  - Path:
    - `userId` (string, required): MongoDB ObjectID of the user (24-character hexadecimal).
- **Response**:
  - **200 OK**:
    ```json
    {
      "user": {
        "_id": "<USER_ID>",
        "name": "John Doe",
        "email": "john@example.com",
        "userType": "student",
        "gender": "Male",
        "session": "2023-2024",
        "department": "Computer Science",
        "studyingSubject": "Mathematics",
        "subjects": [
          { "_id": "<SUBJECT_ID>", "name": "Mathematics" },
          { "_id": "<SUBJECT_ID>", "name": "Science" }
        ],
        "createdAt": "2025-04-23T12:00:00Z",
        "updatedAt": "2025-04-23T12:00:00Z"
      }
    }
    ```
  - **404 Not Found**:
    ```json
    { "message": "User not found" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "message": "Internal server error" }
    ```
- **Example Request**:
  ```bash
  curl "https://api.example.com/profile/getUser/507f1f77bcf86cd799439011"
  ```

## Authentication
- None of the endpoints currently require authentication. It is highly recommended to add JWT token validation (e.g., via `Authorization: Bearer <token>`) for both `/profile/updateProfile/:userId` and `/profile/getUser/:userId` to restrict access to authorized users, as these endpoints handle sensitive user data.

## Error Handling
- **404 Not Found**: User not found.
- **500 Internal Server Error**: Unexpected server issues.

## Notes
- The `/profile/updateProfile/:userId` endpoint supports partial updates, only updating fields provided in the request body.
- The `subjects` field in the request is an array of subject names, which are upserted into the `Subjects` collection, and their IDs are stored in the user’s `subjects` field.
- The `/profile/getUser/:userId` endpoint populates the `subjects` field with full subject details (e.g., `_id`, `name`) from the `Subjects` collection.
- The `password` field, if updated, is stored as provided (consider adding hashing with `bcrypt`, as seen in the `/auth` endpoints, for security).
- No rate-limiting middleware is specified for these endpoints, unlike the `/post` or `/subjects` routes.
- Consider adding validation for fields like `email` (e.g., using `validator.isEmail`) or `userType` (e.g., restricting to "student" or "guardian") to ensure data integrity.
