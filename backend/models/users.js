import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Optional for Google users
    },
    userType: {
      type: String,
      enum: ['student', 'guardian'],
      required: true,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHERS'],
    },
    session: {
      type: String,
    },
    department: {
      type: String,
    },
    studyingSubject: {
      type: String,
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subjects',
      },
    ],
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values for non-Google users
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;