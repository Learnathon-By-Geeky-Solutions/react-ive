import mongoose from 'mongoose';
import { createConversation } from '../controllers/conversations.controller.js';
import Conversation from '../models/conversation.js';

// Mock the Conversation model
jest.mock('../models/conversation');

// Spy on console.error to suppress logs during tests
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('createConversation', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore console.error after all tests
    consoleErrorSpy.mockRestore();
  });

  it('should return existing conversation if one exists', async () => {
    const senderId = new mongoose.Types.ObjectId();
    const receiverId = new mongoose.Types.ObjectId();
    req.body = { senderId, receiverId };
    const mockConversation = {
      id: new mongoose.Types.ObjectId(),
      user1: senderId,
      user2: receiverId,
    };

    Conversation.findOne.mockResolvedValue(mockConversation);

    await createConversation(req, res);

    expect(Conversation.findOne).toHaveBeenCalledWith({
      $or: [
        { user1: new mongoose.Types.ObjectId(senderId), user2: new mongoose.Types.ObjectId(receiverId) },
        { user1: new mongoose.Types.ObjectId(receiverId), user2: new mongoose.Types.ObjectId(senderId) },
      ],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockConversation);
  });

  it('should create a new conversation if none exists', async () => {
    const senderId = new mongoose.Types.ObjectId();
    const receiverId = new mongoose.Types.ObjectId();
    req.body = { senderId, receiverId };
    const mockConversation = {
      id: new mongoose.Types.ObjectId(),
      user1: senderId,
      user2: receiverId,
    };

    Conversation.findOne.mockResolvedValue(null);
    Conversation.create.mockResolvedValue(mockConversation);

    await createConversation(req, res);

    expect(Conversation.findOne).toHaveBeenCalledWith({
      $or: [
        { user1: new mongoose.Types.ObjectId(senderId), user2: new mongoose.Types.ObjectId(receiverId) },
        { user1: new mongoose.Types.ObjectId(receiverId), user2: new mongoose.Types.ObjectId(senderId) },
      ],
    });
    expect(Conversation.create).toHaveBeenCalledWith({
      user1: new mongoose.Types.ObjectId(senderId),
      user2: new mongoose.Types.ObjectId(receiverId),
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockConversation);
  });

  it('should handle database errors', async () => {
    const senderId = new mongoose.Types.ObjectId();
    const receiverId = new mongoose.Types.ObjectId();
    req.body = { senderId, receiverId };

    Conversation.findOne.mockRejectedValue(new Error('Database error'));

    await createConversation(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });

  it('should handle invalid senderId', async () => {
    const senderId = 'invalid-id';
    const receiverId = new mongoose.Types.ObjectId();
    req.body = { senderId, receiverId };

    await createConversation(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user ID(s)' });
  });

  it('should handle invalid receiverId', async () => {
    const senderId = new mongoose.Types.ObjectId();
    const receiverId = 'invalid-id';
    req.body = { senderId, receiverId };

    await createConversation(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user ID(s)' });
  });
});