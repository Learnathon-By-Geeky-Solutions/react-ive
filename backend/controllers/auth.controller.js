import User from '../models/users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req,res) => {
    try {
        const {name,email,password,userType} = req.body;
        
        if (!email || !name || !password || !userType) {
            return res.status(400).json({ message: 'Please provide all required fields: email, name, password, and userType.' });
          }
      
          if (userType !== 'student' && userType !== 'guardian') {
            return res.status(400).json({ message: 'Invalid userType.' });
          }

          const existingUser = await User.findOne({email});
          if(existingUser) {
            return res.status(400).json({error: "Email already registered"});
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          
          const newUser = new User({name,email,password: hashedPassword,userType});
          await newUser.save();

          res.status(201).json({message: "User registered"});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email});

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { userId: user._id, name: user.name,email: user.email, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        );

        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user.id,
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