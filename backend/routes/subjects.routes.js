import express from 'express';
import { getSubjects } from '../controllers/subjects.controller.js';
import rateLimit from 'express-rate-limit';

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const subjectRouter = express.Router();

subjectRouter.get("/getSubjects",generalLimiter, getSubjects);

export default subjectRouter;