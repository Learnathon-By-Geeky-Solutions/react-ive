import express from 'express';
import { createPost } from '../controllers/posts.controller.js';

const postRouter = express.Router();

postRouter.post("/createPost", createPost);

export default postRouter;