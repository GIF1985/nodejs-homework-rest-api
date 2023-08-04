//uploadMiddleware.js
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const tmpDir = path.join(process.cwd(), "tmp");

const storage = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

export const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
});
