# Subjects API Documentation

## Overview
This API provides an endpoint for retrieving all subjects. The endpoint is prefixed with `/subjects`.

## Base URL
`https://api.example.com/subjects`

## Endpoints

### 1. Get All Subjects
- **URL**: `/subjects/getSubjects`
- **Method**: GET
- **Description**: Retrieves a list of all subjects stored in the database.
- **Parameters**: None
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "_id": "<SUBJECT_ID>",
        "name": "Mathematics",
        "createdAt": "2025-04-23T12:00:00Z",
        "updatedAt": "2025-04-23T12:00:00Z"
      },
      {
        "_id": "<SUBJECT_ID>",
        "name": "Science",
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
  curl "https://api.example.com/subjects/getSubjects"
  ```

## Authentication
- This endpoint does not require authentication, allowing public access to the list of subjects. If authentication is desired (e.g., via `Authorization: Bearer <token>`), consider adding JWT token validation to restrict access.

## Rate Limiting
- The `generalLimiter` middleware is applied, allowing a maximum of 100 requests per 15-minute window per IP. Exceeding the limit returns a **429 Too Many Requests** error.

## Error Handling
- **429 Too Many Requests**: Rate limit exceeded.
- **500 Internal Server Error**: Unexpected server issues.

## Notes
- The endpoint returns all subjects stored in the `Subjects` collection, with each subject including its `_id`, `name`, and timestamps (`createdAt`, `updatedAt`).
- Subjects are used in the `/post/createPost` endpoint (see Post API Documentation) to associate job posts with specific subjects via their IDs.
- The response structure assumes a minimal schema for subjects, with `name` as the primary field. If additional fields exist in the `Subjects` model, they will also be included in the response.
