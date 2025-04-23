import mongoose from 'mongoose';
import { getSubjects } from '../controllers/subjects.controller.js';
import Subjects from '../models/subjects.js';

// Mock the Subjects model
jest.mock('../models/subjects.js');

describe('Subjects Controller', () => {
    let mockRequest, mockResponse;
    let subjectId1, subjectId2;
  
    beforeEach(() => {
      // Generate new ObjectIDs for each test
      subjectId1 = new mongoose.Types.ObjectId();
      subjectId2 = new mongoose.Types.ObjectId();
  
      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      // Mock console.error
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });
  
    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks(); // Restore console.error to its original implementation
    });
  
    describe('getSubjects', () => {
      it('should retrieve subjects successfully', async () => {
        // Mock Subjects.find to return a list of subjects with generated ObjectIDs
        const subjects = [
          { _id: subjectId1, name: 'Mathematics' },
          { _id: subjectId2, name: 'Science' }
        ];
        Subjects.find.mockResolvedValueOnce(subjects);
  
        await getSubjects(mockRequest, mockResponse);
  
        // Assertions
        expect(Subjects.find).toHaveBeenCalledWith();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(subjects);
      });
  
      it('should handle server error during retrieval', async () => {
        // Mock Subjects.find to throw an error
        const errorMessage = 'Database error';
        Subjects.find.mockRejectedValueOnce(new Error(errorMessage));
  
        await getSubjects(mockRequest, mockResponse);
  
        // Assertions
        expect(Subjects.find).toHaveBeenCalledWith();
        expect(console.error).toHaveBeenCalledWith('Error fetching subjects:', errorMessage);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
      });
    });
  });