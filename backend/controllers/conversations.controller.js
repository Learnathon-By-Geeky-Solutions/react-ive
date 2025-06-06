import Conversation from "../models/conversation.js";
import User from "../models/users.js";
import Message from "../models/message.js";
import mongoose from "mongoose";

export const getConversations = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find all conversations where the user is either user1 or user2
    const conversations = await Conversation.find({
      $or: [{ user1: userId }, { user2: userId }],
    }).select("id user1 user2");

    // Fetch user details for each conversation
    const users = await Promise.all(
      conversations.map(async ({ id, user1, user2 }) => {
        const otherUserId = user1.toString() === userId ? user2 : user1;

        const user = await User.findById(otherUserId).select("id name email");

        return {
          conversationId: id,
          ...user.toObject(),
        };
      })
    );

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const createConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "Invalid user ID(s)" });
    }

    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

    // Check if a conversation already exists
    const existingConversation = await Conversation.findOne({
      $or: [
        { user1: senderObjectId, user2: receiverObjectId },
        { user1: receiverObjectId, user2: senderObjectId },
      ],
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    // Create a new conversation
    const conversation = await Conversation.create({
      user1: senderObjectId,
      user2: receiverObjectId,
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteConversation = async (req, res) => {
  const { conversationId } = req.params;

  try {
    // Check if the conversation exists
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Delete associated messages first
    await Message.deleteMany({ conversationId });

    // Then delete the conversation itself
    await Conversation.findByIdAndDelete(conversationId);

    return res.status(200).json({ message: "Conversation and all messages deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return res.status(500).json({ error: "Something went wrong while deleting the conversation" });
  }
};
