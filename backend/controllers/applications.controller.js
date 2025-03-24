import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Application from '../models/applications.js'; // Import Mongoose model

export const applyToPost = async (req, res) => {
  try {
    const { userId, status, name } = req.body;
    const { id: postId } = req.params;
    const cvPath = req.file?.filename; // Get file name (since GridFS stores files separately)

    // Verify JWT manually (No auth middleware used)
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userType !== 'student') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    if (!cvPath) {
      return res.status(400).json({ error: 'CV file is required' });
    }

    const application = new Application({
      userName: name,
      userId: new mongoose.Types.ObjectId(userId),
      postId: new mongoose.Types.ObjectId(postId),
      cvPath,
      status,
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};
