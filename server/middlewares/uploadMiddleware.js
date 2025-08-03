import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/categories'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `cat-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  allowed.test(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Hanya file gambar (.jpg .png) yang diizinkan'), false);
};

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter
});
