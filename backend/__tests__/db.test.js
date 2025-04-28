import mongoose from 'mongoose';
import { connectDB } from '../db/connectDB';

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

describe('connectDB', () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    // Spy on console.log and console.error
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore spies
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test('should connect to MongoDB successfully', async () => {
    // Mock successful connection
    mongoose.connect.mockResolvedValueOnce({});

    // Call connectDB
    await connectDB();

    // Verify mongoose.connect was called with correct URI
    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI);
    // Verify success message was logged
    expect(consoleLogSpy).toHaveBeenCalledWith('MongoDB Connected');
    // Verify no error was logged
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  test('should handle MongoDB connection error', async () => {
    // Mock connection error
    const error = new Error('Connection failed');
    mongoose.connect.mockRejectedValueOnce(error);

    // Call connectDB
    await connectDB();

    // Verify mongoose.connect was called with correct URI
    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI);
    // Verify error message was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(`MongoDB Connection Error: ${error.message}`);
    // Verify success message was not logged
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});