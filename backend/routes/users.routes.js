import express from 'express';
import { getUser, updateProfile } from '../controllers/users.controller.js';

const usersRouter = express.Router();

usersRouter.put("/updateProfile/:userId", updateProfile);
usersRouter.get("/getUser/:userId", getUser);
export default usersRouter;