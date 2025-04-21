import express from 'express';
import { updateProfile } from '../controllers/users.controller.js';

const usersRouter = express.Router();

usersRouter.put("/updateProfile/:userId", updateProfile);

export default usersRouter;