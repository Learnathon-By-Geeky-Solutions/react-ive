import { sendMessage, getMessages, deleteMessage } from '../controllers/messages.controller.js';
import Message from '../models/message.js';
import Conversation from '../models/conversation.js';
import { getReceiverSocketId, io } from '../socket/socket.js';
import jwt from 'jsonwebtoken';
import httpMocks from 'node-mocks-http';
import mongoose from 'mongoose';

jest.mock('../models/message.js');
jest.mock('../models/conversation.js');
jest.mock('../socket/socket.js');
jest.mock('jsonwebtoken');

describe('Message Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should return 401 if no token is provided', async () => {
      const req = httpMocks.createRequest({ headers: {} });
      const res = httpMocks.createResponse();

      await sendMessage(req, res);

      expect(res._getStatusCode()).toBe(401);
    });

    it('should create a new message and emit socket if receiver is online', async () => {

      const receiverId = new mongoose.Types.ObjectId();
      const senderId = new mongoose.Types.ObjectId();
      const req = httpMocks.createRequest({
        headers: { authorization: 'Bearer testtoken' },
        params: { id: receiverId },
        body: { message: 'Hello' },
        file: null,
      });
      const res = httpMocks.createResponse();

      jwt.verify.mockReturnValue({ userId: senderId });

      Conversation.findOne.mockResolvedValue(null);
      Conversation.create.mockResolvedValue({ _id: new mongoose.Types.ObjectId(), user1: senderId, user2: receiverId });
      Message.create.mockResolvedValue({ _id: 'msg123', senderId: senderId, receiverId: senderId, content: 'Hello' });
      Conversation.findByIdAndUpdate.mockResolvedValue({});
      getReceiverSocketId.mockReturnValue('socket123');
      io.to.mockReturnValue({ emit: jest.fn() });

      await sendMessage(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(Message.create).toHaveBeenCalled();
      expect(io.to).toHaveBeenCalledWith('socket123');
    });
  });

  describe('getMessages', () => {
    it('should return 401 if token is missing', async () => {
      const req = httpMocks.createRequest({ headers: {} });
      const res = httpMocks.createResponse();

      await getMessages(req, res);

      expect(res._getStatusCode()).toBe(401);
    });

    it('should return 404 if conversation not found', async () => {
      jwt.verify.mockReturnValue({ userId: new mongoose.Types.ObjectId() });

      const req = httpMocks.createRequest({
        headers: { authorization: 'Bearer validtoken' },
        params: { id: new mongoose.Types.ObjectId() },
      });
      const res = httpMocks.createResponse();

      Conversation.findOne.mockResolvedValue(null);

      await getMessages(req, res);

      expect(res._getStatusCode()).toBe(404);
    });

    it('should return messages if conversation exists', async () => {
      const senderId = new mongoose.Types.ObjectId();
      const receiverId = new mongoose.Types.ObjectId();

      jwt.verify.mockReturnValue({ userId: senderId.toString() });

      const req = httpMocks.createRequest({
        headers: { authorization: 'Bearer validtoken' },
        params: { id: receiverId.toString() },
      });
      const res = httpMocks.createResponse();

      Conversation.findOne.mockResolvedValue({ _id: new mongoose.Types.ObjectId() });
      Message.find.mockReturnValue({
        sort: jest.fn().mockReturnValue([{ content: 'Hi' }, { content: 'Hello' }]),
      });

      await getMessages(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual([{ content: 'Hi' }, { content: 'Hello' }]);
    });
  });

  describe('deleteMessage', () => {
    it('should return 404 if message not found', async () => {
      const req = httpMocks.createRequest({ params: { messageId: new mongoose.Types.ObjectId() } });
      const res = httpMocks.createResponse();

      Message.findById.mockResolvedValue(null);

      await deleteMessage(req, res);

      expect(res._getStatusCode()).toBe(404);
    });

    it('should delete message successfully', async () => {
      const req = httpMocks.createRequest({ params: { messageId: new mongoose.Types.ObjectId() } });
      const res = httpMocks.createResponse();

      Message.findById.mockResolvedValue({ _id: new mongoose.Types.ObjectId()  });
      Message.findByIdAndDelete.mockResolvedValue();

      await deleteMessage(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({ message: 'Message deleted successfully' });
    });
  });
});
