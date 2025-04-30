import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Application from '../models/applications.js'; 
import Post from '../models/posts.js';
import cloudinary from 'cloudinary';


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const applyToPost = async (req, res) => {
  try {
    const { userId, status, name } = req.body;
    const { id: postId } = req.params;

    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: 'No token found' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid user ID(s)' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'CV file is required' });
    }

    // Upload file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { resource_type: 'auto', folder: 'cvs' },
        (error, result) => {
          if (error) {
            if (error instanceof Error) {
              reject(error);
            } else {
              const errorMessage = error.message || 'Cloudinary upload failed';
              reject(new Error(errorMessage));
            }
          } else {
            resolve(result);
          }
        }
      );
      stream.end(req.file.buffer);
    });

    const application = new Application({
      userName: name,
      userId,
      postId,
      cvPath: result.secure_url, // Store Cloudinary URL
      status,
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const downloadCV = async (req, res) => {
  try {
    const { filename } = req.params;
    // Assuming filename is the Cloudinary URL or public_id
    // If cvPath in DB is the full URL, you can redirect to it
    const application = await Application.findOne({ cvPath: { $regex: filename } });
    
    if (!application) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Redirect to the Cloudinary URL
    res.redirect(application.cvPath);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getApplicationsById = async (req, res) => {
  const { userId } = req.params;

  try {
    const userPosts = await Post.find({ userId });
    const userPostIds = userPosts.map(post => post._id);
    
    const applications = await Application.find({
      $or: [
        { userId },                   
        { postId: { $in: userPostIds } } 
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
      $or: [{
        postId: new mongoose.Types.ObjectId(postId),
        userId: new mongoose.Types.ObjectId(userId)
      }]
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
