// controllers/order.controller.js
import express from 'express';
import Order from '../models/order.model.js';
import Invoice from '../models/invoice.model.js';
import { assignOrderToInvoice } from '../utils/invoiceHelper.js';
import { getOrdersWithInvoiceStatus } from '../services/orderService.js';

const router = express.Router();
const VALID_STATUSES = ['pending', 'done', 'cancelled'];

// Endpoint untuk menghitung jumlah order berdasarkan status
router.get('/count/:status', async (req, res) => {
  const { status } = req.params;
  try {
    const count = await Order.countDocuments({ status });
    return res.json({ status, count });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  const orders = await getOrdersWithInvoiceStatus({ user: req.user.id });
  res.json(orders);
});

// Endpoint untuk mengubah status order
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validasi status
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Status harus salah satu dari: ${VALID_STATUSES.join(', ')}` });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });

    const prev = order.status;
    order.status = status;

    // Jika berubah dari 'done' ke 'pending' atau 'cancelled'
    if (prev === 'done' && status !== 'done') {
      await Invoice.updateMany(
        { orderIds: order._id },
        {
          $pull: { orderIds: order._id },
          $inc: { totalAmount: -order.totalPrice }
        }
      );
      order.isInvoiceGenerated = false;
    }

    await order.save();

    // Jika berubah jadi 'done' dan belum pernah masuk invoice
    if (status === 'done' && !order.isInvoiceGenerated) {
      const invoice = await assignOrderToInvoice(order.user, order._id, order.totalPrice);
      order.isInvoiceGenerated = true;
      await order.save();
      return res.json({ order, invoice });
    }

    return res.json(order);

  } catch (err) {
    console.error('Error update order status:', err);
    res.status(500).json({ error: 'Server error saat update status order' });
  }
});

export default router;
