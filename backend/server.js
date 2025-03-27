import express from 'express';
import cors from 'cors';
import {app,server} from "./socket/socket.js";
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';
import postRouter from './routes/posts.routes.js';
import applicationRouter from './routes/application.routes.js';
import {connectDB} from './db/connectDB.js'
import messageRouter from './routes/message.routes.js';
import conversationRouter from './routes/conversation.routes.js';
import offerRouter from './routes/offer.routes.js';

dotenv.config();

const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(cors({
    origin: "*",
}))

app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/apply", applicationRouter);
app.use("/message", messageRouter);
app.use("/conversations", conversationRouter);
app.use("/offer", offerRouter);

server.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
    connectDB();
})