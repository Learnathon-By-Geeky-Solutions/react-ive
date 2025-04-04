import express from 'express';
import { applicationExists, applyToPost, downloadCV, getApplicationsById, updateApplicationStatus } from '../controllers/applications.controller.js';
import {upload }from '../middleware/multer.js';
const applicationRouter = express.Router();

applicationRouter.post("/applyPost/:id",upload.single('cv'),applyToPost);
applicationRouter.get("/getApplicationsById/:userId", getApplicationsById);
applicationRouter.post("/applicationExists", applicationExists);
applicationRouter.put("/updateStatus/:applicationId", updateApplicationStatus);
applicationRouter.get("/downloadCV/:filename", downloadCV);
export default applicationRouter;