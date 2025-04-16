import User from '../models/users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import validator from 'validator';

const baseUrl = process.env.FRONTEND_URL;


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const register = async (req, res) => {
    try {
        const { name, email, password, userType } = req.body;

        if (!email || !name || !password || !userType) {
            return res.status(400).json({ message: 'Please provide all required fields: email, name, password, and userType.' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address.' });
        }

        const normalizedEmail = validator.normalizeEmail(email);

        if (userType !== 'student' && userType !== 'guardian') {
            return res.status(400).json({ message: 'Invalid userType.' });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            userType,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        const normalizedEmail = validator.normalizeEmail(email);

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

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

        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                userType: user.userType,
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

export const sendMail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide your email address.' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        const normalizedEmail = validator.normalizeEmail(email);

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const resetToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        const mailOptions = {
            from: `"TutionMedia" <${process.env.EMAIL_USER}>`,
            to: normalizedEmail,
            subject: 'Reset Password',
            html: `
                <p>Hello ${user.name},</p>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${baseUrl}/reset-password?token=${resetToken}">Reset Password</a>
                <p>This link is valid for 10 minutes.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Reset password email sent successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to send reset password email.' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Please provide a token and new password.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error(error.message);

        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }

        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }

        const user = await User.findById(id)
            .populate('student')
            .populate('guardian');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error.' });
    }
};
