import express from "express";
import rateLimit from "express-rate-limit";
import { login, register, sendMail, resetPassword, getUserById, googleAuth, googleAuthCallback} from "../controllers/auth.controller.js";

const authRouter = express.Router();

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 5, 
  message: "Too many login attempts. Try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const resetLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, 
  max: 3,
  message: "Too many password reset requests. Try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post("/register", generalLimiter, register);
authRouter.post("/login", loginLimiter, login);
authRouter.post("/sendMail", generalLimiter, sendMail);
authRouter.post("/resetPassword", resetLimiter, resetPassword);
authRouter.get("/getUserById/:id", generalLimiter, getUserById);
authRouter.get('/google', googleAuth); // Google OAuth start
authRouter.get('/google/callback', googleAuthCallback);
export default authRouter;
