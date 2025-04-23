# Post API Documentation

## Overview
This API provides endpoints for creating, retrieving, and deleting job posts. All endpoints are prefixed with `/post`.

## Base URL
`https://api.example.com/post`

## Endpoints

### 1. Create a Job Post
- **URL**: `/post/createPost`
- **Method**: POST
- **Description**: Creates a new job post for a user, requiring authentication.
- **Parameters**:
  - Body (JSON):
    - `name` (string, required): Title or name of the job post.
    - `salary` (number, required): Salary for the job.
    - `experience` (number, required): Years of experience required.
    - `location` (string, required): Job location.
    - `subject` (array of strings, required): List of subject names (e.g., ["Math", "Science"]).
    - `medium` (string, required): Medium of instruction (e.g., "English").
    - `classtype` (string, required): Type of class (e.g., "Online").
    - `days` (number, required): Number of days per week.
    - `deadline` (string, optional): Deadline for the job post (ISO 8601 format, e.g., "2025-05-01T00:00:00Z").
    - `time` (string, optional): Start time of the class (ISO 8601 format).
    - `duration` (number, optional): Duration of the class in minutes.
    - `studentNum` (number, optional): Number of students.
    - `gender` (string, optional): Preferred gender of the tutor.
- **Headers**:
  - `Content-Type`: application/json
  - `Authorization`: Bearer `<JWT_TOKEN>` (required)
- **Response**:
  - **201 Created**:
    ```json
    {
      "_id": "<POST_ID>",
      "name": "Math Tutor",
      "salary": 50000,
      "experience": 2,
      "location": "New York",
      "subject": ["<SUBJECT_ID_1>", "<SUBJECT_ID_2>"],
      "medium": "English",
      "classtype": "Online",
      "days": 3,
      "deadline": "2025-05-01T00:00:00Z",
      "time": "2025-04-23T10:00:00Z",
      "duration": 60,
      "studentNum": 5,
      "gender": "Any",
      "userId": "<USER_ID>",
      "createdAt": "2025-04-23T12:00:00Z",
      "updatedAt": "2025-04-23T12:00:00Z"
    }
    ```
  - **400 Bad Request**:
    ```json
    { "error": "All fields are required" }
    ```
    ```json
    { "error": "At least one subject is required" }
    ```
  - **401 Unauthorized**:
    ```json
    { "error": "Authorization token missing" }
    ```
    ```json
    { "error": "Invalid or expired token" }
    ```
  - **429 Too Many Requests**:
    ```json
    { "error": "Too many requests, please try again later." }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal server error" }
    ```
- **Example Request**:
  ```bash
  curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <JWT_TOKEN>" -d '{"name":"Math Tutor","salary":50000,"experience":2,"location":"New York","subject":["Math","Science"],"medium":"English","classtype":"Online","days":3,"deadline":"2025-05-01T00:00:00Z","time":"2025-04-23T10:00:00Z","duration":60,"studentNum":5,"gender":"Any"}' "https://api.example.com/post/createPost"
  ```

### 2. Get All Job Posts
- **URL**: `/post/getAllPosts`
- **Method**: GET
- **Description**: Retrieves all job posts, including user and subject details.
- **Parameters**: None
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "_id": "<POST_ID>",
        "name": "Math Tutor",
        "salary": 50000,
        "experience": 2,
        "location": "New York",
        "subject": [{ "_id": "<SUBJECT_ID>", "name": "Math" }],
        "medium": "English",
        "classtype": "Online",
        "days": 3,
        "userId": { "_id": "<USER_ID>", "name": "John Doe", "email": "john@example.com" },
        "createdAt": "2025-04-23T12:00:00Z",
        "updatedAt": "2025-04-23T12:00:00Z"
      }
    ]
    ```
  - **429 Too Many Requests**:
    ```json
    { "error": "Too many requests, please try again later." }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal server error" }
    ```
- **Example Request**:
  ```bash
  curl "https://api.example.com/post/getAllPosts"
  ```

### 3. Get Job Posts by User ID
- **URL**: `/post/getPostById/:id`
- **Method**: GET
- **Description**: Retrieves all job posts created by a specific user, identified by their user ID.
- **Parameters**:
  - Path:
    - `id` (string, required): MongoDB ObjectID of the user (24-character hexadecimal).
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "_id": "<POST_ID>",
        "name": "Math Tutor",
        "salary": 50000,
        "experience": 2,
        "location": "New York",
        "subject": [{ "_id": "<SUBJECT_ID>", "name": "Math" }],
        "medium": "English",
        "classtype": "Online",
        "days": 3,
        "userId": { "_id": "<USER_ID>", "name": "John Doe", "email": "john@example.com" },
        "createdAt": "2025-04-23T12:00:00Z",
        "updatedAt": "2025-04-23T12:00:00Z"
      }
    ]
    ```
  - **400 Bad Request**:
    ```json
    { "error": "Invalid user ID format" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "Job posts not found" }
    ```
  - **429 Too Many Requests**:
    ```json
    { "error": "Too many requests, please try again later." }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal server error" }
    ```
- **Example Request**:
  ```bash
  curl "https://api.example.com/post/getPostById/507f1f77bcf86cd799439011"
  ```

### 4. Delete a Job Post
- **URL**: `/post/deletePost/:id`
- **Method**: DELETE
- **Description**: Deletes a job post by its ID, requiring authentication.
- **Parameters**:
  - Path:
    - `id` (string, required): MongoDB ObjectID of the post (24-character hexadecimal).
- **Headers**:
  - `Authorization`: Bearer `<JWT_TOKEN>` (required)
- **Response**:
  - **200 OK**:
    ```json
    { "message": "Post deleted successfully" }
    ```
  - **400 Bad Request**:
    ```json
    { "error": "Invalid Post ID format" }
    ```
  - **401 Unauthorized**:
    ```json
    { "error": "Authorization token missing" }
    ```
    ```json
    { "error": "Invalid or expired token" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "Post not found" }
    ```
  - **429 Too Many Requests**:
    ```json
    { "error": "Too many requests, please try again later." }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal server error" }
    ```
- **Example Request**:
  ```bash
  curl -X DELETE -H "Authorization: Bearer <JWT_TOKEN>" "https://api.example.com/post/deletePost/507f1f77bcf86cd799439011"
  ```

## Authentication
- The `/post/createPost` and `/post/deletePost/:id` endpoints require a valid JWT token in the `Authorization` header as `Bearer <token>`.
- Tokens are obtained via the `/auth/login` endpoint (see Authentication API Documentation).
- The `/post/getAllPosts` and `/post/getPostById/:id` endpoints do not require authentication.

## Rate Limiting
- All endpoints use the `generalLimiter`, allowing a maximum of 100 requests per 15-minute window per IP.
- Exceeding the limit returns a **429 Too Many Requests** error.

## Error Handling
- **400 Bad Request**: Invalid or missing parameters.
- **401 Unauthorized**: Missing or invalid JWT token.
- **404 Not Found**: Resource (e.g., post or user posts) not found.
- **429 Too Many Requests**: Rate limit exceeded.
- **500 Internal Server Error**: Unexpected server issues.

## Notes
- Subject names provided in `/post/createPost` are upserted into the `Subject` collection, and their IDs are stored in the post.
- Posts are populated with `userId` (name and email) and `subject` (name) in responses for `/post/getAllPosts` and `/post/getPostById/:id`.
- The `deadline` and `time` fields, if provided, must be in ISO 8601 format.
- Numeric fields (`salary`, `experience`, `days`, `duration`, `studentNum`) are parsed to appropriate types before saving.
