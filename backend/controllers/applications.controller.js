import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Application from '../models/applications.js'; // Import Mongoose model
import path from 'path';
import { fileURLToPath } from 'url';

const __filename  = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export const getApplicationsById = async (req, res) => {
  const { userId } = req.params; 

  try {
    const applications = await Application.find({ userId })
      .populate({
        path: 'postId',
        populate: {
          path: 'userId', 
          model: 'User' // Assuming 'User' is the correct model name
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


export const applicationExists = async (req, res) => {
  const { postId, userId } = req.body;

  try {
    const exists = await Application.findOne({ postId, userId });

    if (exists) {
      return res.status(200).json({ message: "exists" });
    }
    res.status(400).json({ message: "does not exist" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  try {
    // Validate if the status is allowed
    const allowedStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'UNDER_REVIEW'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find and update application
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
export const downloadCV = async (req,res) => {
  const {filename} = req.params;
  const filePath = path.join(__dirname, "..", "middleware/uploads", filename);

  res.download(filePath, filename, (err)=> {
    if(err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  })
}

import Post from '../models/posts.js';

export const getApplicationsForGuardian = async (req, res) => {
  const { userId } = req.params; // Guardian ID

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid guardian userId' });
  }

  try {
    // Step 1: Find all posts created by this guardian
    const posts = await Post.find({ userId }).select('_id');

    const postIds = posts.map(post => post._id);

    if (postIds.length === 0) {
      return res.status(404).json({ message: 'No posts found for this guardian' });
    }

    // Step 2: Find all applications submitted to those posts
    const applications = await Application.find({ postId: { $in: postIds } })
    .populate({
      path: 'postId',
      populate: {
        path: 'userId', 
        model: 'User' // Assuming 'User' is the correct model name
      }
    })
      .sort({ createdAt: -1 });

    return res.status(200).json({applications: applications});
  } catch (error) {
    console.error('Error fetching applications for guardian:', error);
    return res.status(500).json({ error: 'Server error while fetching applications' });
  }
};
