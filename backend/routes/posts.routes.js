import express from 'express';
import { createPost, deletePost, getAllPosts, getPostByUserId, getSkills } from '../controllers/posts.controller.js';

const postRouter = express.Router();

postRouter.post("/createPost", createPost);
postRouter.get("/getAllPosts", getAllPosts);
postRouter.get("/getPostByUserId/:id", getPostByUserId);
postRouter.delete("/deletePost/:id", deletePost);
postRouter.get("/getSkills", getSkills);

export default postRouter;