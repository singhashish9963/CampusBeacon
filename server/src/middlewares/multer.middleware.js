import multer from "multer";
import { diskStorage } from "multer";
import { extname as _extname } from "path";

const storage = diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/temp"); 
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

const fileFilter = (_req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(_extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
});
