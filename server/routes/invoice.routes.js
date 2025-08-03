// server/routes/invoice.routes.js
import express from 'express';
import multer from 'multer';
import * as invoiceCtrl from '../controllers/invoice.controller.js';
import auth from '../middlewares/auth.js';

// konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });
const router = express.Router();

router.get('/', auth, invoiceCtrl.listInvoices);
router.get('/:id', invoiceCtrl.getInvoice);
router.post('/:id/upload-proof', auth, upload.single('proof'), invoiceCtrl.uploadProof);
router.patch('/:id/verify', auth, invoiceCtrl.verifyInvoice);
router.patch('/:id/status', auth, invoiceCtrl.updateInvoiceStatus);

export default router;
