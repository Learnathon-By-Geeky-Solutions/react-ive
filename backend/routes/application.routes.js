import express from 'express';
import { applyToPost } from '../controllers/applications.controller.js';
import {upload }from '../middleware/multer.js';
const applicationRouter = express.Router();

applicationRouter.post("/applyPost/:id",upload.single('cv'),applyToPost);

export default applicationRouter;