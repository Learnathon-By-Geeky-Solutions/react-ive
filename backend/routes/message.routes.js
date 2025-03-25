import express from 'express';
import { sendMessage } from '../controllers/messages.controller.js';

const messageRouter = express.Router();

messageRouter.post("/sendMessage/:id", sendMessage);

export default messageRouter;