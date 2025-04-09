import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      fileUrl: {
        type: String,
        default: null,
      },
      fileType: {
        type: String,
        default: null,
      },
      conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
      },
    },
    { timestamps: true }
  );
  
  const Message = mongoose.model('Message', MessageSchema);
  export default Message;
  