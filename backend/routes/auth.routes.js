import express from 'express';
import { login, register, sendMail, resetPassword, getUserById } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/sendMail", sendMail);
authRouter.post("/resetPassword", resetPassword);
authRouter.get("/getUserById/:id", getUserById);

export default authRouter;