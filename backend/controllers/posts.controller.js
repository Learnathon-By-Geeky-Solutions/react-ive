import jwt from 'jsonwebtoken';
import Post from '../models/posts.js';
import Skill from '../models/skills.js';
import mongoose from 'mongoose';

const verifyToken = (token) => {
  if (!token) {
    throw new Error('Authorization token missing');
  }
  return jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
};

const validateJobPostData = ({ name, position, salary, experience, location, skills }) => {
  if (!name || !position || !salary || !experience || !location) {
    throw new Error('All fields are required');
  }
  if (!Array.isArray(skills) || skills.length === 0) {
    throw new Error('At least one skill is required');
  }
};

// Function to upsert skills and return their IDs
const upsertSkills = async (skills) => {
  return Promise.all(
    skills.map(async (skillName) => {
      const skill = await Skill.findOneAndUpdate(
        { name: skillName },   // Search by skill name
        { name: skillName },   // If found, update (no actual change)
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return skill._id;  // Return skill ID
    })
  );
};

export const createPost = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = verifyToken(token);

    if (decoded.userType !== 'guardian') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const { name, position, salary, experience, location, skills, deadline } = req.body;
    validateJobPostData({ name, position, salary, experience, location, skills });

    const skillIds = await upsertSkills(skills);

    const post = new Post({
      name,
      position,
      salary: parseFloat(salary),
      experience: parseInt(experience),
      location,
      userId: decoded.userId,  
      deadline: deadline ? new Date(deadline) : null,
      requiredSkills: skillIds
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getAllPosts = async (req,res) => {
  try {
    const posts = await Post.find().populate("userId").sort({createdAt:-1});
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getAllPosts:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getPostByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const jobPosts = await Post.find({ userId: id })
      .populate("userId", "name email") 
      .populate("skills", "name"); 

    if (!jobPosts || jobPosts.length === 0) {
      return res.status(404).json({ error: 'Job posts not found' });
    }

    res.status(200).json(jobPosts);
  } catch (error) {
    console.error("Error fetching job posts:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Post ID format" });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await Post.deleteOne({ _id: id });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find(); 
    res.status(200).json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};