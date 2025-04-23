# Message API Documentation

## Overview
This API provides endpoints for sending, retrieving, and deleting messages between users in a conversation. All endpoints are prefixed with `/message`.

## Base URL
`https://api.example.com/message`

## Endpoints

### 1. Send a Message
- **URL**: `/message/send/:id`
- **Method**: POST
- **Description**: Sends a message (text or file) to a specified user, creating a conversation if none exists. Supports real-time notifications via WebSockets.
- **Parameters**:
  - Path:
    - `id` (string, required): MongoDB ObjectID of the receiver user (24-character hexadecimal).
  - Body (multipart/form-data):
    - `message` (string, optional): Text content of the message (1–5000 characters).
    - `file` (file, optional): File attachment (JPEG, PNG, PDF, or plain text).
- **Headers**:
  - `Content-Type`: multipart/form-data
  - `Authorization`: Bearer `<JWT_TOKEN>` (required)
- **Response**:
  - **201 Created**:
    ```json
    {
      "_id": "<MESSAGE_ID>",
      "senderId": "<SENDER_ID>",
      "receiverId": "<RECEIVER_ID>",
      "content": "Hello, how are you?",
      "fileUrl": "attachment_123456789.pdf",
      "fileType": "application/pdf",
      "conversationId": "<CONVERSATION_ID>",
      "createdAt": "2025-04-23T12:00:00Z",
      "updatedAt": "2025-04-23T12:00:00Z"
    }
    ```
  - **400 Bad Request**:
    ```json
    { "error": "Invalid user ID(s)" }
    ```
    ```json
    { "error": "Sender and Receiver cannot be the same" }
    ```
    ```json
    { "error": "Message must be between 1 and 5000 characters" }
    ```
    ```json
    { "error": "Invalid file type" }
    ```
  - **401 Unauthorized**:
    ```json
    { "message": "Unauthorized access" }
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
  curl -X POST -H "Authorization: Bearer <JWT_TOKEN>" -F "message=Hello, how are you?" -F "file=@/path/to/document.pdf" "https://api.example.com/message/send/507f1f77bcf86cd799439011"
  ```

### 2. Get Messages in a Conversation
- **URL**: `/message/getMessage/:id`
- **Method**: GET
- **Description**: Retrieves all messages in a conversation between the authenticated user and the specified user, sorted by creation time.
- **Parameters**:
  - Path:
    - `id` (string, required): MongoDB ObjectID of the other user in the conversation (24-character hexadecimal).
- **Headers**:
  - `Authorization`: Bearer `<JWT_TOKEN>` (required)
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "_id": "<MESSAGE_ID>",
        "senderId": "<SENDER_ID>",
        "receiverId": "<RECEIVER_ID>",
        "content": "Hello, how are you?",
        "fileUrl": "attachment_123456789.pdf",
        "fileType": "application/pdf",
        "conversationId": "<CONVERSATION_ID>",
        "createdAt": "2025-04-23T12:00:00Z",
        "updatedAt": "2025-04-23T12:00:00Z"
      }
    ]
    ```
  - **400 Bad Request**:
    ```json
    { "error": "Invalid user ID(s)" }
    ```
  - **401 Unauthorized**:
    ```json
    { "message": "Unauthorized access" }
    ```
    ```json
    { "error": "Invalid or expired token" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "Conversation not found" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal Server Error" }
    ```
- **Example Request**:
  ```bash
  curl -H "Authorization: Bearer <JWT_TOKEN>" "https://api.example.com/message/getMessage/507f1f77bcf86cd799439011"
  ```

### 3. Delete a Message
- **URL**: `/message/deleteMessage/:messageId`
- **Method**: DELETE
- **Description**: Deletes a specific message by its ID.
- **Parameters**:
  - Path:
    - `messageId` (string, required): MongoDB ObjectID of the message (24-character hexadecimal).
- **Response**:
  - **200 OK**:
    ```json
    { "message": "Message deleted successfully" }
    ```
  - **400 Bad Request**:
    ```json
    { "error": "Invalid message ID" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "Message not found" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Something went wrong while deleting the message" }
    ```
- **Example Request**:
  ```bash
  curl -X DELETE "https://api.example.com/message/deleteMessage/507f1f77bcf86cd799439012"
  ```

## Authentication
- The `/message/send/:id` and `/message/getMessage/:id` endpoints require a valid JWT token in the `Authorization` header as `Bearer <token>`.
- Tokens are obtained via the `/auth/login` endpoint (see Authentication API Documentation).
- The `/message/deleteMessage/:messageId` endpoint does not require authentication, though you may want to add authorization to restrict deletion to the message sender or receiver.

## Error Handling
- **400 Bad Request**: Invalid or missing parameters (e.g., user IDs, message length, file type).
- **401 Unauthorized**: Missing or invalid JWT token.
- **404 Not Found**: Resource (e.g., conversation, message) not found.
- **500 Internal Server Error**: Unexpected server issues.

## Notes
- The `/message/send/:id` endpoint supports file uploads (JPEG, PNG, PDF, or plain text) using the `multer` middleware, with files stored and referenced via `fileUrl`.
- Message content is sanitized using `validator.escape` to prevent XSS attacks.
- Conversations are automatically created if they don’t exist when sending a message.
- Real-time notifications are sent via WebSockets to the receiver if they are online, using the `socket.io` library.
- Messages are stored in a `Conversation` document, which links two users and their message history.
- The `deleteMessage` endpoint does not currently enforce authorization, so any user can delete any message (consider adding a check for `senderId` or `receiverId`).
