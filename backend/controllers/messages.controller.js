import jwt from 'jsonwebtoken';
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

        if (!message || !senderId || !receiverId) {
            return res.status(400).json({ error: "Sender ID, Receiver ID, file , and message content are required" });
        }

        if (senderId === receiverId) {
            return res.status(400).json({ error: "Sender and Receiver cannot be the same" });
        }

        // Check if a conversation exists
        let conversation = await Conversation.findOne({
            $or: [
                { user1: senderId, user2: receiverId },
                { user1: receiverId, user2: senderId }
            ]
        });

        // If conversation doesn't exist, create one
        if (!conversation) {
            conversation = await Conversation.create({
                user1: senderId,
                user2: receiverId
            });
        }

        // Create and save the message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            content: message || null,
            fileUrl: file ? file.filename : null,
            fileType: file ? file.mimetype : null,
            conversationId: conversation._id
        });

        // Push the message into conversation
        await Conversation.findByIdAndUpdate(conversation._id, {
            $push: { messages: newMessage._id }
        });

        // Emit message to receiver if online
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

        // Find the conversation
        const conversation = await Conversation.findOne({
            $or: [
                { user1: senderId, user2: receiverId },
                { user1: receiverId, user2: senderId }
            ]
        });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        // Retrieve messages for the conversation
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

        // Check if the message exists
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Delete the message
        await Message.findByIdAndDelete(messageId);

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ error: 'Something went wrong while deleting the message' });
    }
};
