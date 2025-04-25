import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, register, sendMail, resetPassword, getUserById } from '../controllers/auth.controller.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const resetLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 3,
  message: 'Too many password reset requests. Try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post('/register', generalLimiter, register);
authRouter.post('/login', loginLimiter, login);
authRouter.post('/sendMail', generalLimiter, sendMail);
authRouter.post('/resetPassword', resetLimiter, resetPassword);
authRouter.get('/getUserById/:id', generalLimiter, getUserById);

// Google OAuth routes
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
authRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login' }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );
    res.redirect(`http://localhost:5173/auth/success?token=${token}`);
  }
);

export default authRouter;