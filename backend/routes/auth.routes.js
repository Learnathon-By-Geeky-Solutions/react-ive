import express from 'express';
import { login, register, sendMail, resetPassword } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/sendMail", sendMail);
authRouter.post("/resetPassword", resetPassword);

export default authRouter;