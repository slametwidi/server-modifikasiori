// server/controllers/invoice.controller.js
import Invoice from '../models/invoice.model.js';

export const listInvoices = async (req, res) => {
    if (!req.user?.role) {
      return res.status(403).json({ message: 'Tidak dapat membaca role user' });
    }
    const filter = req.user.role === 'reseller' ? { user: req.user._id } : {};
    const invoices = await Invoice.find(filter)
    .populate({ path: 'user', select: '-password' })
    .populate({
      path: 'orderIds',
     match: { status: 'done' }, // hanya order dengan status done
     populate: {
       path: 'items.product',
       select: 'name'
      }
    });
    res.json(invoices);
  };
  

export const getInvoice = async (req, res) => {
  const inv = await Invoice.findById(req.params.id).populate('user orderIds');
  if (!inv) return res.status(404).json({ msg: 'Invoice not found' });
  res.json(inv);
};

export const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const inv = await Invoice.findById(id);
    if (!inv) return res.status(404).json({ message: 'Invoice not found' });

    inv.status = status;
    inv.history.push({
      action: `status-changed-to-${status}`,
      by: req.user?.role || 'system',
      timestamp: new Date()
    });
    await inv.save();

    const populated = await Invoice.findById(id)
      .populate('user')
      .populate({
        path: 'orderIds',
        populate: { path: 'items.product', select: 'name' }
      });

    res.json(populated);
  } catch (err) {
    console.error('Error updateInvoiceStatus:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadProof = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    if (!req.file) return res.status(400).json({ msg: 'File tidak ditemukan' });

    const filename = req.file.filename;
    const updatedInvoice = await Invoice.findByIdAndUpdate(
  invoiceId,
  {
    status: 'paid',
    $push: {
      proofFileUrls: filename,
      history: { action: 'proof_uploaded', by: req.user._id, timestamp: new Date() }
    }
  },
  { new: true }
).populate('user').populate({ path: 'orderIds', populate: { path: 'items.product', select: 'name' } });

    if (!updatedInvoice) return res.status(404).json({ msg: 'Invoice tidak ditemukan' });
    res.json(updatedInvoice);

  } catch (err) {
    console.error('Error uploadProof:', err);
    res.status(500).json({ msg: 'Gagal upload bukti pembayaran' });
  }
};

// PATCH /api/invoices/:id/verify
export const verifyInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice tidak ditemukan' });

    const paid = req.body.paidAmount;
    const filename = req.file?.filename;

    if (!paid) return res.status(400).json({ error: 'Jumlah pembayaran tidak valid' });

    // Tambahkan ke history
    invoice.paymentHistory.push({
      paidAmount: paid,
      proofFileUrl: filename || '',
      paidAt: new Date()
    });

    invoice.paidAmount = (invoice.paidAmount || 0) + paid;
    invoice.status = invoice.paidAmount >= invoice.totalAmount ? 'done' : 'partial';

    // Tambahkan file ke array proofFileUrls
    if (filename) {
      invoice.proofFileUrls = invoice.proofFileUrls || [];
      invoice.proofFileUrls.push(filename);
    }

    await invoice.save();

    const populated = await Invoice.findById(invoice._id)
      .populate('user')
      .populate({ path: 'orderIds', populate: { path: 'items.product', select: 'name' } });

    res.json(populated);
  } catch (err) {
    console.error('❌ Gagal verifikasi invoice:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
