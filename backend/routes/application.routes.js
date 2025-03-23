import express from 'express';
import { applyToPost } from '../controllers/applications.controller.js';
import upload from '../config/storage.js';

const applicationRouter = express.Router();

applicationRouter.post("/applyPost/:id",upload.single('cv'), applyToPost);

export default applicationRouter;