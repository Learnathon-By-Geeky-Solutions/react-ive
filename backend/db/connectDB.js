import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn.connection.db; // Return database instance
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Export connection and GridFS setup
let gfs;
const initGridFS = async () => {
  const db = await connectDB();
  gfs = new mongoose.mongo.GridFSBucket(db, { bucketName: 'cvs' });
  console.log('✅ GridFS Initialized');
};

export { connectDB, initGridFS, gfs };
