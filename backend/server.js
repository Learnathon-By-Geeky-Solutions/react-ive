import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/connectDB.js';
import authRouter from './routes/auth.routes.js';
import postRouter from './routes/posts.routes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(cors({
    origin: "*",
}))

app.use("/auth", authRouter);
app.use("/post", postRouter);

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
    connectDB();
})