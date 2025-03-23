import express from 'express';
import { createPost, getAllPosts } from '../controllers/posts.controller.js';

const postRouter = express.Router();

postRouter.post("/createPost", createPost);
postRouter.get("/getAllPosts", getAllPosts);

export default postRouter;