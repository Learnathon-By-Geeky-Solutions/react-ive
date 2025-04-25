import express from 'express';
import cors from 'cors';
import { app, server } from './socket/socket.js';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';
import postRouter from './routes/posts.routes.js';
import applicationRouter from './routes/application.routes.js';
import { connectDB } from './db/connectDB.js';
import messageRouter from './routes/message.routes.js';
import conversationRouter from './routes/conversation.routes.js';
import subjectRouter from './routes/subjects.routes.js';
import usersRouter from './routes/users.routes.js';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js'; // Import to initialize Passport

dotenv.config();

const PORT = process.env.PORT || 3500;

// Initialize Express app
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Configure session middleware
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/apply', applicationRouter);
app.use('/message', messageRouter);
app.use('/conversation', conversationRouter);
app.use('/subjects', subjectRouter);
app.use('/profile', usersRouter);

// Start server
server.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
  connectDB();
});