import jwt from 'jsonwebtoken';
import Post from '../models/posts.js';
import Subject from '../models/subjects.js';
import mongoose from 'mongoose';

const verifyToken = (token) => {
  if (!token) throw new Error('Authorization token missing');
  return jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
};

const validateJobPostData = ({ name, salary, experience, location, subject, medium, classtype, days }) => {
  if (!name || !salary || !experience || !location || !medium || !classtype || !days) {
    throw new Error('All fields are required');
  }
  if (!Array.isArray(subject) || subject.length === 0) {
    throw new Error('At least one subject is required');
  }
};

// Upsert subjects and return their IDs
const upsertSubjects = async (subjectNames) => {
  return Promise.all(
    subjectNames.map(async (subjectName) => {
      const subject = await Subject.findOneAndUpdate(
        { name: subjectName },
        { name: subjectName },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return subject._id;
    })
  );
};

export const createPost = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = verifyToken(token);


    const { name, salary, experience, location, subject, medium, classtype, days, deadline, time, duration, studentNum, gender } = req.body;
    validateJobPostData({ name, salary, experience, location, subject, medium, classtype, days });

    const subjectIds = await upsertSubjects(subject);

    const post = new Post({
      name,
      salary: parseFloat(salary),
      experience: parseInt(experience),
      location,
      medium,
      classtype,
      days: parseInt(days),
      deadline: deadline ? new Date(deadline) : null,
      time: time ? new Date(time) : null,
      duration: parseInt(duration),
      studentNum: parseInt(studentNum),
      gender,
      userId: decoded.userId,
      subject: subjectIds,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name email")
      .populate("subject", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getAllPosts:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPostByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const jobPosts = await Post.find({ userId: id })
      .populate("userId", "name email")
      .populate("subject", "name");

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
      return res.status(400).json({ error: "Invalid Post ID format" });
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

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
