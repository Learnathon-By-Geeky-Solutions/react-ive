# Application API Documentation

## Overview
This API provides endpoints for managing job applications, including applying to posts, retrieving applications, checking application existence, updating application status, and downloading CV files. All endpoints are prefixed with `/apply`.

## Base URL
`https://api.example.com/apply`

## Endpoints

### 1. Apply to a Job Post
- **URL**: `/apply/applyToPost/:id`
- **Method**: POST
- **Description**: Submits an application to a job post, including a CV file, requiring authentication.
- **Parameters**:
  - Path:
    - `id` (string, required): MongoDB ObjectID of the job post (24-character hexadecimal).
  - Body (multipart/form-data):
    - `userId` (string, required): MongoDB ObjectID of the applying user.
    - `status` (string, required): Initial status of the application (e.g., "PENDING").
    - `name` (string, required): Name of the applicant.
    - `cv` (file, required): CV file to be uploaded (e.g., PDF).
- **Headers**:
  - `Content-Type`: multipart/form-data
  - `Authorization`: Bearer `<JWT_TOKEN>` (required)
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Application submitted successfully",
      "application": {
        "_id": "<APPLICATION_ID>",
        "userName": "John Doe",
        "userId": "<USER_ID>",
        "postId": "<POST_ID>",
        "cvPath": "cv_123456789.pdf",
        "status": "PENDING",
        "createdAt": "2025-04-23T12:00:00Z",
        "updatedAt": "2025-04-23T12:00:00Z"
      }
    }
    ```
  - **400 Bad Request**:
    ```json
    { "error": "Invalid user ID(s)" }
    ```
    ```json
    { "error": "CV file is required" }
    ```
  - **401 Unauthorized**:
    ```json
    { "error": "Authorization token required" }
    ```
    ```json
    { "error": "No token found" }
    ```
    ```json
    { "error": "Invalid or expired token" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal server error" }
    ```
- **Example Request**:
  ```bash
  curl -X POST -H "Authorization: Bearer <JWT_TOKEN>" -F "userId=507f1f77bcf86cd799439011" -F "status=PENDING" -F "name=John Doe" -F "cv=@/path/to/cv.pdf" "https://api.example.com/apply/applyToPost/507f1f77bcf86cd799439012"
  ```

### 2. Get Applications by User ID
- **URL**: `/apply/getApplicationsById/:userId`
- **Method**: GET
- **Description**: Retrieves all applications made by a user or applications to posts created by the user.
- **Parameters**:
  - Path:
    - `userId` (string, required): MongoDB ObjectID of the user (24-character hexadecimal).
- **Response**:
  - **200 OK**:
    ```json
    {
      "applications": [
        {
          "_id": "<APPLICATION_ID>",
          "userName": "John Doe",
          "userId": "<USER_ID>",
          "postId": {
            "_id": "<POST_ID>",
            "name": "Math Tutor",
            "userId": { "_id": "<USER_ID>", "name": "Jane Doe", "email": "jane@example.com" }
          },
          "cvPath": "cv_123456789.pdf",
          "status": "PENDING",
          "createdAt": "2025-04-23T12:00:00Z",
          "updatedAt": "2025-04-23T12:00:00Z"
        }
      ]
 
   }
    ```
  - **404 Not Found**:
    ```json
    { "message": "No applications found for this user" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal server error" }
    ```
- **Example Request**:
  ```bash
  curl "https://api.example.com/apply/getApplicationsById/507f1f77bcf86cd799439011"
  ```

### 3. Get Applications for Guardian’s Posts
- **URL**: `/apply/getApplicationsForGuardian/:userId`
- **Method**: GET
- **Description**: Retrieves all applications for job posts created by a guardian user.
- **Parameters**:
  - Path:
    - `userId` (string, required): MongoDB ObjectID of the guardian user (24-character hexadecimal).
- **Response**:
  - **200 OK**:
    ```json
    {
      "applications": [
        {
          "_id": "<APPLICATION_ID>",
          "userName": "John Doe",
          "userId": "<USER_ID>",
          "postId": {
            "_id": "<POST_ID>",
            "name": "Math Tutor",
            "userId": { "_id": "<USER_ID>", "name": "Jane Doe", "email": "jane@example.com" }
          },
          "cvPath": "cv_123456789.pdf",
          "status": "PENDING",
          "createdAt": "2025-04-23T12:00:00Z",
          "updatedAt": "2025-04-23T12:00:00Z"
        }
      ]
    }
    ```
  - **400 Bad Request**:
    ```json
    { "error": "Invalid guardian userId" }
    ```
  - **404 Not Found**:
    ```json
    { "message": "No posts found for this guardian" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Server error while fetching applications" }
    ```
- **Example Request**:
  ```bash
  curl "https://api.example.com/apply/getApplicationsForGuardian/507f1f77bcf86cd799439011"
  ```

### 4. Check Application Existence
- **URL**: `/apply/exists`
- **Method**: POST
- **Description**: Checks if an application exists for a specific user and job post.
- **Parameters**:
  - Body (JSON):
    - `postId` (string, required): MongoDB ObjectID of the job post.
    - `userId` (string, required): MongoDB ObjectID of the user.
- **Headers**:
  - `Content-Type`: application/json
- **Response**:
  - **200 OK** (if application exists):
    ```json
    { "message": "exists" }
    ```
  - **400 Bad Request** (if application does not exist):
    ```json
    { "message": "does not exist" }
    ```
    ```json
    { "message": "Invalid postId or user - **400 Bad Request**: Invalid or missing parameters.
- **401 Unauthorized**: Missing or invalid JWT token.
- **404 Not Found**: Resource (e.g., application, post) not found.
- **500 Internal Server Error**: Unexpected server issues.

## Notes
- The `/apply/applyToPost/:id` endpoint uses `multipart/form-data` for file uploads, handled by the `multer` middleware.
- CV files are stored in the `middleware/uploads` directory, and their filenames are saved in the `cvPath` field.
- The `status` field in applications can be one of: `PENDING`, `ACCEPTED`, `REJECTED`, or `UNDER_REVIEW`.
- Applications are populated with `postId` and the associated `userId` (post creator) in responses for `/apply/getApplicationsById/:userId` and `/apply/getApplicationsForGuardian/:userId`.
- The `downloadCV` endpoint serves files directly from the server’s file system.
