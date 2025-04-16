import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import validator from 'validator';
import Message from '../models/message.js';
import Conversation from '../models/conversation.js';
import { getReceiverSocketId, io } from '../socket/socket.js';

export const sendMessage = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const senderId = decoded.userId;
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const file = req.file;

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ error: "Invalid user ID(s)" });
        }

        if (senderId === receiverId) {
            return res.status(400).json({ error: "Sender and Receiver cannot be the same" });
        }

        // Validate message content
        if (message && !validator.isLength(message, { min: 1, max: 5000 })) {
            return res.status(400).json({ error: "Message must be between 1 and 5000 characters" });
        }

        // Validate file type (optional)
        if (file) {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return res.status(400).json({ error: "Invalid file type" });
            }
        }

        // Check or create conversation
        let conversation = await Conversation.findOne({
            $or: [
                { user1: senderId, user2: receiverId },
                { user1: receiverId, user2: senderId }
            ]
        });

        if (!conversation) {
            conversation = await Conversation.create({
                user1: senderId,
                user2: receiverId
            });
        }

        // Create message securely
        const newMessage = await Message.create({
            senderId: new mongoose.Types.ObjectId(senderId),
            receiverId: new mongoose.Types.ObjectId(receiverId),
            content: validator.escape(message),
            fileUrl: file ? validator.escape(file.filename) : null,
            fileType: file ? file.mimetype : null,
            conversationId: conversation._id
        });

        await Conversation.findByIdAndUpdate(conversation._id, {
            $push: { messages: newMessage._id }
        });

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const senderId = decoded.userId;
        const { id: receiverId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ error: "Invalid user ID(s)" });
        }

        const conversation = await Conversation.findOne({
            $or: [
                { user1: senderId, user2: receiverId },
                { user1: receiverId, user2: senderId }
            ]
        });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: "asc" });
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(messageId)) {
            return res.status(400).json({ error: "Invalid message ID" });
        }

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        await Message.findByIdAndDelete(messageId);

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ error: 'Something went wrong while deleting the message' });
    }
};
