import express from 'express';

const postRouter = express.Router();

postRouter.post("/register", register);
postRouter.post("/login", login);
postRouter.post("/sendMail", sendMail);
postRouter.post("/resetPassword", resetPassword);
postRouter.get("/getUserById/:id", getUserById);

export default postRouter;