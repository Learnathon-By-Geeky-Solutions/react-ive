import PropTypes from 'prop-types';
import { transformPostData, fetchAllPosts, postPropType } from '../components/PostUtils';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../utils/servicesData';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('postUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('transformPostData', () => {
    const mockPost = {
      _id: '123',
      name: 'Math Tutor',
      location: 'New York',
      medium: 'Online',
      salary: 50000,
      experience: 3,
      classtype: 'Private',
      studentNum: 5,
      subject: [{ name: 'Algebra' }, { name: 'Calculus' }],
      gender: 'Any',
      deadline: '2025-12-31',
      days: 'Mon, Wed, Fri',
      time: '10:00 AM',
      duration: 60,
      userId: {
        _id: 'user123',
        name: 'John Doe',
      },
    };

    test('transforms post data correctly', () => {
      const transformed = transformPostData(mockPost);

      expect(transformed).toEqual({
        jobDetails: {
          title: 'Math Tutor',
          location: 'New York',
          medium: 'Online',
          salaryRange: '50000',
          experience: '3 years',
          classType: 'Private',
          studentNum: 5,
          subjects: 'Algebra, Calculus',
          gender: 'Any',
          deadline: '2025-12-31',
          jobPostId: '123',
        },
        schedule: {
          days: 'Mon, Wed, Fri',
          time: '10:00 AM',
          duration: '60 mins',
        },
        userInfo: {
          guardianName: 'John Doe',
          userId: 'user123',
        },
      });
    });

    test('handles empty subject array', () => {
      const postWithNoSubjects = { ...mockPost, subject: [] };
      const transformed = transformPostData(postWithNoSubjects);

      expect(transformed.jobDetails.subjects).toBe('No subjects listed');
    });

    test('handles missing subject property', () => {
      const postWithNoSubjects = { ...mockPost };
      delete postWithNoSubjects.subject;
      const transformed = transformPostData(postWithNoSubjects);

      expect(transformed.jobDetails.subjects).toBe('No subjects listed');
    });
  });

  describe('fetchAllPosts', () => {
    const mockPosts = [
      {
        _id: '123',
        name: 'Math Tutor',
        location: 'New York',
        userId: { _id: 'user123', name: 'John Doe' },
      },
    ];

    test('fetches posts successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPosts),
      });

      const result = await fetchAllPosts();

      expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/post/getAllPosts`);
      expect(result).toEqual(mockPosts);
      expect(toast.error).not.toHaveBeenCalled();
    });

    test('handles fetch error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ error: 'Server error' }),
      });

      const result = await fetchAllPosts();

      expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/post/getAllPosts`);
      expect(toast.error).toHaveBeenCalledWith('Server error');
      expect(result).toEqual([]);
    });

    test('handles network error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchAllPosts();

      expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/post/getAllPosts`);
      expect(toast.error).toHaveBeenCalledWith('Network error');
      expect(result).toEqual([]);
    });
  });

  describe('postPropType', () => {
    test('postPropType is defined correctly', () => {
        expect(postPropType).toBeDefined();
        // Structural validation is handled by checkPropTypes tests below
      });

    test('postPropType validates correct props', () => {
      // Use PropTypes.checkPropTypes to validate a sample prop
      const sampleProps = {
        _id: '123',
        name: 'Math Tutor',
        location: 'New York',
        userId: { _id: 'user123', name: 'John Doe' },
        medium: 'Online',
        salary: 50000,
        experience: 3,
        subject: [{ name: 'Algebra' }],
        classtype: 'Private',
        days: 'Mon, Wed',
        duration: 60,
        studentNum: 5,
        gender: 'Any',
        deadline: '2025-12-31',
        time: '10:00 AM',
        createdAt: '2025-01-01',
      };

      const checkPropTypes = require('prop-types').checkPropTypes;
      const consoleError = console.error;
      console.error = jest.fn(); // Suppress PropTypes warnings

      checkPropTypes({ post: postPropType }, { post: sampleProps }, 'post', 'TestComponent');

      expect(console.error).not.toHaveBeenCalled();
      console.error = consoleError; // Restore console.error
    });

    test('postPropType fails on invalid props', () => {
      // Test with invalid props (e.g., missing required _id)
      const invalidProps = {
        name: 'Math Tutor',
        location: 'New York',
        userId: { _id: 'user123', name: 'John Doe' },
      };

      const checkPropTypes = require('prop-types').checkPropTypes;
      const consoleError = console.error;
      console.error = jest.fn(); // Suppress PropTypes warnings

      checkPropTypes({ post: postPropType }, { post: invalidProps }, 'post', 'TestComponent');

      expect(console.error).toHaveBeenCalled();
      console.error = consoleError; // Restore console.error
    });
  });
});