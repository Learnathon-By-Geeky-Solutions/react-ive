import express from 'express';
import { hire } from '../controllers/hires.controller.js';

const hireRouter = express.Router();

hireRouter.post("/hire", hire)

export default hireRouter;