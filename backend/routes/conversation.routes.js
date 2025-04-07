import express from 'express';
import { createConversation, deleteConversation, getConversations } from '../controllers/conversations.controller.js';
const conversationRouter = express.Router();

conversationRouter.post("/createConversation", createConversation)
conversationRouter.get("/getConversations/:id", getConversations);
conversationRouter.delete("/deleteConversation/:conversationId", deleteConversation);

export default conversationRouter;