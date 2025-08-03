import multer from 'multer';
import path from 'path';

// Simpan file di folder 'uploads' di project root
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/');
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

export const upload = multer({ storage });

export function uploadImageController(req, res) {
  if (!req.file) return res.status(400).json({ message: 'File tidak ditemukan' });
  res.json({ url: `http://localhost:${process.env.PORT}/${req.file.filename}` });
}
