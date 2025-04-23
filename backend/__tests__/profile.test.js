import { updateProfile, getUser } from '../controllers/users.controller.js'
import User from '../models/users.js';
import Subjects from '../models/subjects.js';
import mongoose from 'mongoose';
// Mock the User and Subjects models
jest.mock('../models/users.js');
jest.mock('../models/subjects.js');

describe('Profile Controller', () => {
  let mockRequest, mockResponse;
  let userId, subjectId1, subjectId2;

  beforeEach(() => {
    // Generate new ObjectIDs for each test
    userId = new mongoose.Types.ObjectId();
    subjectId1 = new mongoose.Types.ObjectId();
    subjectId2 = new mongoose.Types.ObjectId();

    mockRequest = {
      params: { userId: userId.toString() },
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateProfile', () => {
    it('should update user profile successfully with all fields', async () => {
      // Mock User.findById to return a user
      User.findById.mockResolvedValueOnce({ _id: userId });

      // Mock Subjects.findOne and Subjects.create for subjects
      Subjects.findOne
        .mockResolvedValueOnce(null) // First subject not found
        .mockResolvedValueOnce({ _id: subjectId2, name: 'Science' }); // Second subject found
      Subjects.create.mockResolvedValueOnce({ _id: subjectId1, name: 'Mathematics' });

      // Mock User.findByIdAndUpdate to return updated user
      const updatedUser = {
        _id: userId,
        name: 'Updated Name',
        email: 'updated@example.com',
        userType: 'student',
        gender: 'Male',
        session: '2023-2024',
        department: 'Computer Science',
        studyingSubject: 'Mathematics',
        subjects: [subjectId1, subjectId2]
      };
      User.findByIdAndUpdate.mockResolvedValueOnce(updatedUser);

      // Set request body with all fields
      mockRequest.body = {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'newpassword',
        userType: 'student',
        gender: 'Male',
        session: '2023-2024',
        department: 'Computer Science',
        studyingSubject: 'Mathematics',
        subjects: ['Mathematics', 'Science']
      };

      await updateProfile(mockRequest, mockResponse);

      // Assertions
      expect(User.findById).toHaveBeenCalledWith(userId.toString());
      expect(Subjects.findOne).toHaveBeenCalledTimes(2);
      expect(Subjects.findOne).toHaveBeenCalledWith({ name: 'Mathematics' });
      expect(Subjects.findOne).toHaveBeenCalledWith({ name: 'Science' });
      expect(Subjects.create).toHaveBeenCalledWith({ name: 'Mathematics' });
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        userId.toString(),
        {
          name: 'Updated Name',
          email: 'updated@example.com',
          password: 'newpassword',
          userType: 'student',
          gender: 'Male',
          session: '2023-2024',
          department: 'Computer Science',
          studyingSubject: 'Mathematics',
          subjects: [subjectId1, subjectId2]
        },
        { new: true }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    });

    it('should update user profile successfully with partial fields (no subjects)', async () => {
      // Mock User.findById to return a user
      User.findById.mockResolvedValueOnce({ _id: userId });

      // Mock User.findByIdAndUpdate to return updated user
      const updatedUser = {
        _id: userId,
        name: 'Updated Name'
      };
      User.findByIdAndUpdate.mockResolvedValueOnce(updatedUser);

      // Set request body with only name
      mockRequest.body = { name: 'Updated Name' };

      await updateProfile(mockRequest, mockResponse);

      // Assertions
      expect(User.findById).toHaveBeenCalledWith(userId.toString());
      expect(Subjects.findOne).not.toHaveBeenCalled();
      expect(Subjects.create).not.toHaveBeenCalled();
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        userId.toString(),
        { name: 'Updated Name' },
        { new: true }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    });

    it('should return 404 if user is not found', async () => {
      // Mock User.findById to return null
      User.findById.mockResolvedValueOnce(null);

      await updateProfile(mockRequest, mockResponse);

      // Assertions
      expect(User.findById).toHaveBeenCalledWith(userId.toString());
      expect(Subjects.findOne).not.toHaveBeenCalled();
      expect(Subjects.create).not.toHaveBeenCalled();
      expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle invalid subjects array', async () => {
      // Mock User.findById to return a user
      User.findById.mockResolvedValueOnce({ _id: userId });

      // Set request body with invalid subjects (not an array)
      mockRequest.body = { subjects: 'not-an-array' };

      // Mock User.findByIdAndUpdate to return updated user
      const updatedUser = { _id: userId };
      User.findByIdAndUpdate.mockResolvedValueOnce(updatedUser);

      await updateProfile(mockRequest, mockResponse);

      // Assertions
      expect(User.findById).toHaveBeenCalledWith(userId.toString());
      expect(Subjects.findOne).not.toHaveBeenCalled();
      expect(Subjects.create).not.toHaveBeenCalled();
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        userId.toString(),
        {},
        { new: true }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    });

    it('should handle server error during update', async () => {
      // Mock User.findById to throw an error
      User.findById.mockRejectedValueOnce(new Error('Database error'));

      await updateProfile(mockRequest, mockResponse);

      // Assertions
      expect(User.findById).toHaveBeenCalledWith(userId.toString());
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getUser', () => {
    it('should retrieve user successfully with populated subjects', async () => {
      // Mock User.findById to return a user with populated subjects
      const user = {
        _id: userId,
        name: 'John Doe',
        subjects: [{ _id: subjectId1, name: 'Mathematics' }]
      };
      User.findById.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(user)
      });

      await getUser(mockRequest, mockResponse);

      // Assertions
      expect(User.findById).toHaveBeenCalledWith(userId.toString());
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ user });
    });

    it('should return 404 if user is not found', async () => {
      // Mock User.findById to return null
      User.findById.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(null)
      });

      await getUser(mockRequest, mockResponse);

      // Assertions
      expect(User.findById).toHaveBeenCalledWith(userId.toString());
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle server error during retrieval', async () => {
      // Mock User.findById to throw an error
      User.findById.mockReturnValueOnce({
        populate: jest.fn().mockRejectedValueOnce(new Error('Database error'))
      });

      await getUser(mockRequest, mockResponse);

      // Assertions
      expect(User.findById).toHaveBeenCalledWith(userId.toString());
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});