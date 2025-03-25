import express from 'express';
import { deleteMessage, getMessages, sendMessage } from '../controllers/messages.controller.js';

const messageRouter = express.Router();

messageRouter.post("/sendMessage/:id", sendMessage);
messageRouter.get("/getMessage/:id", getMessages);
messageRouter.delete("/deleteMessage/:messageId", deleteMessage);
export default messageRouter;