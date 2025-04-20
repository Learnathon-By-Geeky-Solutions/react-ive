import mongoose from "mongoose";
import Conversation from "../models/conversation.js";
import User from "../models/users.js";
import Message from "../models/message.js";

// Get all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const userId = req.params.id?.toString();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const conversations = await Conversation.find({
      $or: [{ user1: userId }, { user2: userId }],
    }).select("id user1 user2");

    const users = await Promise.all(
      conversations.map(async ({ id, user1, user2 }) => {
        const otherUserId = user1.toString() === userId ? user2 : user1;
        const user = await User.findById(otherUserId).select("id name email");
        return {
          conversationId: id,
          ...user?.toObject(),
        };
      })
    );

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Server error while fetching conversations" });
  }
};

// Create a new conversation between two users
export const createConversation = async (req, res) => {
  try {
    let { senderId, receiverId } = req.body;

    senderId = senderId?.toString();
    receiverId = receiverId?.toString();

    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "Invalid sender or receiver ID" });
    }

    const existingConversation = await Conversation.findOne({
      $or: [
        { user1: senderId, user2: receiverId },
        { user1: receiverId, user2: senderId },
      ],
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const newConversation = await Conversation.create({
      user1: senderId,
      user2: receiverId,
    });

    res.status(201).json(newConversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Server error while creating conversation" });
  }
};

// Delete a conversation and its messages
export const deleteConversation = async (req, res) => {
  const conversationId = req.params.conversationId?.toString();

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(400).json({ error: "Invalid conversation ID" });
  }

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    await Message.deleteMany({ conversationId });
    await Conversation.findByIdAndDelete(conversationId);

    res.status(200).json({ message: "Conversation and its messages deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ error: "Server error while deleting conversation" });
  }
};
