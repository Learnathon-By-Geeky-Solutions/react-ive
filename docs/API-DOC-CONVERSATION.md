# Conversation API Documentation

## Overview
This API provides endpoints for managing conversations between users, including creating, retrieving, and deleting conversations. All endpoints are prefixed with `/conversation`.

## Base URL
`https://api.example.com/conversation`

## Endpoints

### 1. Create a Conversation
- **URL**: `/conversation/createConversation`
- **Method**: POST
- **Description**: Creates a new conversation between two users or returns an existing conversation if one already exists.
- **Parameters**:
  - Body (JSON):
    - `senderId` (string, required): MongoDB ObjectID of the initiating user (24-character hexadecimal).
    - `receiverId` (string, required): MongoDB ObjectID of the other user (24-character hexadecimal).
- **Headers**:
  - `Content-Type`: application/json
- **Response**:
  - **201 Created** (new conversation):
    ```json
    {
      "_id": "<CONVERSATION_ID>",
      "user1": "<SENDER_ID>",
      "user2": "<RECEIVER_ID>",
      "messages": [],
      "createdAt": "2025-04-23T12:00:00Z",
      "updatedAt": "2025-04-23T12:00:00Z"
    }
    ```
  - **200 OK** (existing conversation):
    ```json
    {
      "_id": "<CONVERSATION_ID>",
      "user1": "<SENDER_ID>",
      "user2": "<RECEIVER_ID>",
      "messages": ["<MESSAGE_ID>"],
      "createdAt": "2025-04-23T12:00:00Z",
      "updatedAt": "2025-04-23T12:00:00Z"
    }
    ```
  - **400 Bad Request**:
    ```json
    { "error": "Invalid user ID(s)" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal server error" }
    ```
- **Example Request**:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"senderId":"507f1f77bcf86cd799439011","receiverId":"507f1f77bcf86cd799439012"}' "https://api.example.com/conversation/createConversation"
  ```

### 2. Get Conversations for a User
- **URL**: `/conversation/getConversations/:id`
- **Method**: GET
- **Description**: Retrieves all conversations involving a specified user, including details of the other user in each conversation.
- **Parameters**:
  - Path:
    - `id` (string, required): MongoDB ObjectID of the user (24-character hexadecimal).
- **Response**:
  - **200 OK**:
    ```json
    {
      "users": [
        {
          "conversationId": "<CONVERSATION_ID>",
          "id": "<OTHER_USER_ID>",
          "name": "Jane Doe",
          "email": "jane@example.com"
        }
      ]
    }
    ```
  - **500 Internal Server Error**:
    ```json
    { "success": false, "message": "Server error" }
    ```
- **Example Request**:
  ```bash
  curl "https://api.example.com/conversation/getConversations/507f1f77bcf86cd799439011"
  ```

### 3. Delete a Conversation
- **URL**: `/conversation/deleteConversation/:conversationId`
- **Method**: DELETE
- **Description**: Deletes a conversation and all associated messages.
- **Parameters**:
  - Path:
    - `conversationId` (string, required): MongoDB ObjectID of the conversation (24-character hexadecimal).
- **Response**:
  - **200 OK**:
    ```json
    { "message": "Conversation and all messages deleted successfully" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "Conversation not found" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Something went wrong while deleting the conversation" }
    ```
- **Example Request**:
  ```bash
  curl -X DELETE "https://api.example.com/conversation/deleteConversation/507f1f77bcf86cd799439013"
  ```

## Authentication
- None of the endpoints currently require authentication. However, it is recommended to add JWT token validation (e.g., via `Authorization: Bearer <token>`) for `/conversation/createConversation`, `/conversation/getConversations/:id`, and `/conversation/deleteConversation/:conversationId` to restrict access to authorized users, especially for sensitive operations like deleting conversations.

## Error Handling
- **400 Bad Request**: Invalid or missing parameters (e.g., user IDs).
- **404 Not Found**: Resource (e.g., conversation) not found.
- **500 Internal Server Error**: Unexpected server issues.

## Notes
- The `/conversation/createConversation` endpoint checks for existing conversations to prevent duplicates and returns the existing conversation if found.
- The `/conversation/getConversations/:id` endpoint returns user details (ID, name, email) for the other participant in each conversation, enhancing usability for client applications.
- The `/conversation/deleteConversation/:conversationId` endpoint deletes both the conversation and all associated messages in the `Message` collection.
- No rate-limiting middleware is specified for these endpoints, unlike some other routes (e.g., `/post`).
- Consider adding authentication to ensure only authorized users can create, view, or delete conversations, as these operations involve sensitive user data.
