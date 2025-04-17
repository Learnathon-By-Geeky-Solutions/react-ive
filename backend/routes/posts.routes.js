import express from 'express';
import { createPost, deletePost, getAllPosts, getPostByUserId } from '../controllers/posts.controller.js';
import rateLimit from "express-rate-limit";

const postRouter = express.Router();

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

postRouter.post("/createPost", generalLimiter, createPost);
postRouter.get("/getAllPosts", generalLimiter,getAllPosts);
postRouter.get("/getPostById/:id", generalLimiter,getPostByUserId);
postRouter.delete("/deletePost/:id", generalLimiter, deletePost);

export default postRouter;