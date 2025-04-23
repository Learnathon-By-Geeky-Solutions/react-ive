import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { createPost, getAllPosts, getPostByUserId, deletePost } from '../controllers/posts.controller.js';
import Post from '../models/posts.js';
import Subjects from '../models/subjects.js';

// Mock the dependencies
jest.mock('jsonwebtoken');
jest.mock('../models/posts.js');
jest.mock('../models/subjects.js');

describe('Posts Controller', () => {
  let mockRequest, mockResponse;
  let userId, postId, subjectId1, subjectId2;

  beforeEach(() => {
    // Generate new ObjectIDs for each test
    userId = new mongoose.Types.ObjectId();
    postId = new mongoose.Types.ObjectId();
    subjectId1 = new mongoose.Types.ObjectId();
    subjectId2 = new mongoose.Types.ObjectId();

    mockRequest = {
      headers: { authorization: 'Bearer validToken' },
      body: {},
      params: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('Helper Functions', () => {
    describe('verifyToken', () => {
      it('should verify token successfully', () => {
        const token = 'Bearer validToken';
        jwt.verify.mockReturnValueOnce({ userId: userId.toString() });

        const result = require('../controllers/posts.controller').verifyToken(token);

        expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_SECRET);
        expect(result).toEqual({ userId: userId.toString() });
      });

      it('should throw error if token is missing', () => {
        expect(() => require('../controllers/posts.controller').verifyToken(null)).toThrow('Authorization token missing');
      });

      it('should throw error if token is invalid', () => {
        jwt.verify.mockImplementationOnce(() => { throw new Error('Invalid token'); });

        expect(() => require('../controllers/posts.controller').verifyToken('Bearer invalidToken'))
          .toThrow('Invalid token');
      });
    });

    describe('validateJobPostData', () => {
      it('should pass validation with valid data', () => {
        const data = {
          name: 'Job Post',
          salary: '50000',
          experience: '2',
          location: 'City',
          subject: ['Mathematics'],
          medium: 'English',
          classtype: 'Online',
          days: '5'
        };

        expect(() => require('../controllers/posts.controller').validateJobPostData(data)).not.toThrow();
      });

      it('should throw error if a required field is missing', () => {
        const data = {
          name: 'Job Post',
          salary: '50000',
          experience: '2',
          location: 'City',
          subject: ['Mathematics'],
          medium: 'English',
          classtype: 'Online'
          // days is missing
        };

        expect(() => require('../controllers/posts.controller').validateJobPostData(data))
          .toThrow('All fields are required');
      });

      it('should throw error if subject is not an array or is empty', () => {
        const data = {
          name: 'Job Post',
          salary: '50000',
          experience: '2',
          location: 'City',
          subject: [],
          medium: 'English',
          classtype: 'Online',
          days: '5'
        };

        expect(() => require('../controllers/posts.controller').validateJobPostData(data))
          .toThrow('At least one subject is required');

        data.subject = 'not-an-array';
        expect(() => require('../controllers/posts.controller').validateJobPostData(data))
          .toThrow('At least one subject is required');
      });
    });

    describe('upsertSubjects', () => {
      it('should upsert subjects and return their IDs', async () => {
        Subject.findOneAndUpdate
          .mockResolvedValueOnce({ _id: subjectId1, name: 'Mathematics' })
          .mockResolvedValueOnce({ _id: subjectId2, name: 'Science' });

        const subjectNames = ['Mathematics', 'Science'];
        const result = await require('../controllers/posts.controller').upsertSubjects(subjectNames);

        expect(Subject.findOneAndUpdate).toHaveBeenCalledTimes(2);
        expect(Subject.findOneAndUpdate).toHaveBeenCalledWith(
          { name: 'Mathematics' },
          { name: 'Mathematics' },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        expect(result).toEqual([subjectId1, subjectId2]);
      });
    });
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      // Mock token verification
      jwt.verify.mockReturnValueOnce({ userId: userId.toString() });

      // Mock upsertSubjects
      Subject.findOneAndUpdate
        .mockResolvedValueOnce({ _id: subjectId1, name: 'Mathematics' });

      // Mock Post creation
      const newPost = {
        _id: postId,
        name: 'Job Post',
        salary: 50000,
        experience: 2,
        location: 'City',
        medium: 'English',
        classtype: 'Online',
        days: 5,
        deadline: new Date('2025-05-01'),
        time: new Date('2025-05-01T10:00:00Z'),
        duration: 60,
        studentNum: 10,
        gender: 'Any',
        userId: userId.toString(),
        subject: [subjectId1]
      };
      Post.mockImplementation(() => newPost);
      Post.prototype.save = jest.fn().mockResolvedValueOnce(newPost);

      // Set request body
      mockRequest.body = {
        name: 'Job Post',
        salary: '50000',
        experience: '2',
        location: 'City',
        subject: ['Mathematics'],
        medium: 'English',
        classtype: 'Online',
        days: '5',
        deadline: '2025-05-01',
        time: '2025-05-01T10:00:00Z',
        duration: '60',
        studentNum: '10',
        gender: 'Any'
      };

      await createPost(mockRequest, mockResponse);

      // Assertions
      expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_SECRET);
      expect(Subject.findOneAndUpdate).toHaveBeenCalledTimes(1);
      expect(Post).toHaveBeenCalledWith({
        name: 'Job Post',
        salary: 50000,
        experience: 2,
        location: 'City',
        medium: 'English',
        classtype: 'Online',
        days: 5,
        deadline: new Date('2025-05-01'),
        time: new Date('2025-05-01T10:00:00Z'),
        duration: 60,
        studentNum: 10,
        gender: 'Any',
        userId: userId.toString(),
        subject: [subjectId1]
      });
      expect(newPost.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(newPost);
    });

    it('should handle missing token', async () => {
      mockRequest.headers.authorization = null;

      await createPost(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Authorization token missing' });
    });

    it('should handle validation error', async () => {
      jwt.verify.mockReturnValueOnce({ userId: userId.toString() });

      mockRequest.body = {
        name: 'Job Post',
        salary: '50000',
        experience: '2',
        location: 'City',
        subject: [],
        medium: 'English',
        classtype: 'Online',
        days: '5'
      };

      await createPost(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'At least one subject is required' });
    });

    it('should handle server error', async () => {
      jwt.verify.mockReturnValueOnce({ userId: userId.toString() });
      mockRequest.body = {
        name: 'Job Post',
        salary: '50000',
        experience: '2',
        location: 'City',
        subject: ['Mathematics'],
        medium: 'English',
        classtype: 'Online',
        days: '5'
      };
      Subject.findOneAndUpdate.mockRejectedValueOnce(new Error('Database error'));

      await createPost(mockRequest, mockResponse);

      expect(console.error).toHaveBeenCalledWith('Error creating post:', 'Database error');
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('getAllPosts', () => {
    it('should retrieve all posts successfully', async () => {
      const posts = [
        {
          _id: postId,
          name: 'Job Post',
          userId: { _id: userId, name: 'User', email: 'user@example.com' },
          subject: [{ _id: subjectId1, name: 'Mathematics' }]
        }
      ];
      Post.find.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValueOnce(posts)
      });

      await getAllPosts(mockRequest, mockResponse);

      expect(Post.find).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(posts);
    });

    it('should handle server error', async () => {
      Post.find.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockRejectedValueOnce(new Error('Database error'))
      });

      await getAllPosts(mockRequest, mockResponse);

      expect(console.error).toHaveBeenCalledWith('Error in getAllPosts:', 'Database error');
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getPostByUserId', () => {
    it('should retrieve posts by user ID successfully', async () => {
      mockRequest.params.id = userId.toString();
      const posts = [
        {
          _id: postId,
          userId: { _id: userId, name: 'User', email: 'user@example.com' },
          subject: [{ _id: subjectId1, name: 'Mathematics' }]
        }
      ];
      Post.find.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValueOnce(posts)
      });

      await getPostByUserId(mockRequest, mockResponse);

      expect(Post.find).toHaveBeenCalledWith({ userId: userId.toString() });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(posts);
    });

    it('should return 400 for invalid user ID', async () => {
      mockRequest.params.id = 'invalid-id';

      await getPostByUserId(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid user ID format' });
    });

    it('should return 404 if no posts are found', async () => {
      mockRequest.params.id = userId.toString();
      Post.find.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValueOnce([])
      });

      await getPostByUserId(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Job posts not found' });
    });

    it('should handle server error', async () => {
      mockRequest.params.id = userId.toString();
      Post.find.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockRejectedValueOnce(new Error('Database error'))
      });

      await getPostByUserId(mockRequest, mockResponse);

      expect(console.error).toHaveBeenCalledWith('Error fetching job posts:', 'Database error');
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      mockRequest.params.id = postId.toString();
      Post.findById.mockResolvedValueOnce({ _id: postId });
      Post.deleteOne.mockResolvedValueOnce({});

      await deletePost(mockRequest, mockResponse);

      expect(Post.findById).toHaveBeenCalledWith(postId.toString());
      expect(Post.deleteOne).toHaveBeenCalledWith({ _id: postId.toString() });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Post deleted successfully' });
    });

    it('should return 400 for invalid post ID', async () => {
      mockRequest.params.id = 'invalid-id';

      await deletePost(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid Post ID format' });
    });

    it('should return 404 if post is not found', async () => {
      mockRequest.params.id = postId.toString();
      Post.findById.mockResolvedValueOnce(null);

      await deletePost(mockRequest, mockResponse);

      expect(Post.findById).toHaveBeenCalledWith(postId.toString());
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });

    it('should handle server error', async () => {
      mockRequest.params.id = postId.toString();
      Post.findById.mockRejectedValueOnce(new Error('Database error'));

      await deletePost(mockRequest, mockResponse);

      expect(console.error).toHaveBeenCalledWith('Error deleting post:', 'Database error');
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});