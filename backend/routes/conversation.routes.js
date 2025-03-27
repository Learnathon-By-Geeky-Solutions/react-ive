import express from 'express';
import { deleteConversation, getConversations } from '../controllers/conversations.controller.js';
const conversationRouter = express.Router();

conversationRouter.get("/getConversation/:id",getConversations);
conversationRouter.delete("/deleteConversation/:conversationId", deleteConversation);

export default conversationRouter;