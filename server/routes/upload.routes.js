import express from 'express';
import multer from 'multer';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Config umum storage
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}-${file.fieldname}.${ext}`);
  }
});

// Filter upload_resi = hanya PDF
const uploadResi = multer({
  storage,
  fileFilter: (req, file, cb) =>
    file.fieldname === 'resi' && file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(new Error('Hanya PDF untuk resi!'))
});

// Filter upload_image = hanya JPEG/PNG
const uploadImage = multer({
  storage,
  fileFilter: (req, file, cb) =>
    (file.fieldname === 'file') &&
    ['image/jpeg','image/png','image/webp'].includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Hanya gambar (jpg/png/webp)!'))
});

// Routes
router.post('/upload-resi', auth, uploadResi.single('resi'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File resi tidak diterima' });
  res.json({ message: 'Resi berhasil diupload', filename: req.file.filename });
});

router.post('/upload-image', auth, uploadImage.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File gambar tidak diterima' });

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const fullUrl = `${baseUrl}/uploads/${req.file.filename}`;

  res.json({ url: fullUrl });
});


export default router;
