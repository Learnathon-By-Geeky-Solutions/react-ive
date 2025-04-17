import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Application from '../models/applications.js'; // Import Mongoose model
import Post from '../models/posts.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Apply to a post
export const applyToPost = async (req, res) => {
  try {
    const { userId, status, name } = req.body;
    const { id: postId } = req.params;
    const cvPath = req.file?.filename;

    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // if (decoded.userType !== 'student') {
    //   return res.status(403).json({ error: 'Permission denied' });
    // }

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

// Get applications for a user
export const getApplicationsById = async (req, res) => {
  const { userId } = req.params;

  try {
    // First, find all posts created by this user
    const userPosts = await Post.find({ userId });
    const userPostIds = userPosts.map(post => post._id);
    
    // Find applications where userId matches OR the application is for a post created by the user
    const applications = await Application.find({
      $or: [
        { userId },                   // Applications made by the user
        { postId: { $in: userPostIds } } // Applications to posts created by the user
      ]
    }).populate({
      path: 'postId',
      populate: {
        path: 'userId',
        model: 'User'
      }
    });

    if (!applications.length) {
      return res.status(404).json({ message: "No applications found for this user" });
    }
    res.status(200).json({ applications });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Secure and validated application existence check
export const applicationExists = async (req, res) => {
  const { postId, userId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(postId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return res.status(400).json({ message: 'Invalid postId or userId' });
  }

  try {
    const exists = await Application.findOne({
      postId: new mongoose.Types.ObjectId(postId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (exists) {
      return res.status(200).json({ message: "exists" });
    }
    res.status(400).json({ message: "does not exist" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  try {
    const allowedStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'UNDER_REVIEW'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { status, statusUpdatedAt: Date.now() },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Download CV file
export const downloadCV = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "..", "middleware/uploads", filename);

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
};

// Get all applications for a guardian's posts
export const getApplicationsForGuardian = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid guardian userId' });
  }

  try {
    const posts = await Post.find({ userId }).select('_id');
    const postIds = posts.map(post => post._id);

    if (postIds.length === 0) {
      return res.status(404).json({ message: 'No posts found for this guardian' });
    }

    const applications = await Application.find({ postId: { $in: postIds } })
      .populate({
        path: 'postId',
        populate: {
          path: 'userId',
          model: 'User'
        }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching applications for guardian:', error);
    return res.status(500).json({ error: 'Server error while fetching applications' });
  }
};
