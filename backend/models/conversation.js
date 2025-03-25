import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
  },
  { timestamps: true }
);

ConversationSchema.index({ user1: 1, user2: 1 }, { unique: true });

const Conversation = mongoose.model('Conversation', ConversationSchema);
export default Conversation;
