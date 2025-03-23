import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

// GridFS Storage for CV Uploads
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => ({
    filename: `cv_${Date.now()}_${file.originalname}`,
    bucketName: 'cvs',
  }),
});

const upload = multer({ storage });

export default upload;
