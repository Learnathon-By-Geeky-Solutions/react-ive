import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'UNDER_REVIEW'],
      default: 'PENDING',
    },
    statusUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    cvPath: {
      type: String, // Store file path or URL
      default: null, // Optional CV upload
    },
  },
  { timestamps: true }
);

// Ensure a user can apply only once per job post
ApplicationSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Application = mongoose.model('Application', ApplicationSchema);

export default Application;
