import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    cb(null, uploadPath); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Setting file size limit to 5MB (5 * 1024 * 1024 bytes)
export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});
