import express from 'express';
import { deleteMessage, getMessages, sendMessage } from '../controllers/messages.controller.js';
import { upload } from '../middleware/multer.js';

const messageRouter = express.Router();

messageRouter.post("/send/:id", upload.single("file"), sendMessage);
messageRouter.get("/getMessage/:id", getMessages);
messageRouter.delete("/deleteMessage/:messageId", deleteMessage);
export default messageRouter;