import jwt from 'jsonwebtoken';
import Post from '../models/posts.js';
import Skill from '../models/skills.js';

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
