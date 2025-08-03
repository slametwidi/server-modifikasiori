// routes/order.routes.js
import express from 'express';
import OrderModel from '../models/order.model.js';
import CartModel from '../models/cart.model.js';
import auth from '../middlewares/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Checkout
router.post('/checkout', auth, async (req, res) => {
  try {
    const { items, totalPrice, resiFile } = req.body;
    if (!items?.length) {
      return res.status(400).json({ message: 'Cart kosong' });
    }
    const order = new OrderModel({
      user: req.user.id,
      items,
      totalPrice,
      resiFile: resiFile || null,
      isPaid: false,
    });
    await order.save();
    await CartModel.findOneAndDelete({ user: req.user.id });
    res.status(201).json({ message: 'Order berhasil dibuat', order });
  } catch (err) {
    console.error('❌ Checkout error:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});

// Get all orders
router.get('/', auth, async (req, res) => {
  const orders = await OrderModel
    .find()
    .populate('user', 'name email')
    .populate('items.product', 'name brand priceGeneral');
  res.json(orders);
});

// Count orders
router.get('/count', async (req, res) => {
  try {
    const total = await OrderModel.countDocuments({});
    res.json({ total });
  } catch (err) {
    console.error('Error Order count:', err);
    res.status(500).json({ error: 'Cannot get order count' });
  }
});

// Revenue aggregation
router.get('/revenue', async (req, res) => {
  try {
    const result = await OrderModel.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    res.json({ total: result[0]?.totalRevenue || 0 });
  } catch (err) {
    console.error('Error calculating revenue:', err);
    res.status(500).json({ error: 'Cannot calculate revenue' });
  }
});

// Ringkasan total order, pending, omset, dan produk
router.get('/my/summary', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      console.error('Invalid userId di summary:', userId);
      return res.status(400).json({ error: 'Invalid userId' });
    }

    const totalOrders = await OrderModel.countDocuments({ user: userId });
    const totalPending = await OrderModel.countDocuments({ user: userId, status: 'pending' });

    const agg = await OrderModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), status: 'done' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = agg[0]?.total || 0;

    const doneOrders = await OrderModel.find({ user: userId, status: 'done' });
    const totalProducts = doneOrders.reduce((acc, o) =>
      acc + o.items.reduce((sum, item) => sum + (item.qty || 0), 0), 0);

    res.json({ totalOrders, totalPending, totalRevenue, totalProducts });
  } catch (err) {
    console.error('Error GET /orders/my/summary:', err.stack);
    res.status(500).json({ error: err.message });
  }
});

// src/routes/order.routes.js
router.get('/my/top-product', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const userId = req.user.id;
    const top = await OrderModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), status: 'done' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQty: { $sum: '$items.qty' },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          name: '$productInfo.name',
          totalQty: 1,
        },
      },
    ]);

    console.log('DEBUG top-product', top);
    res.json(top[0] || {});
  } catch (err) {
    console.error('❌ Error di /my/top-product:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});


// Get single order
router.get('/:id', auth, async (req, res) => {
  const order = await OrderModel
    .findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.product', 'name brand priceGeneral');
  if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });
  res.json(order);
});

// Update packingTeam
router.patch('/:id/packing', auth, async (req, res) => {
  const { packingTeam } = req.body;
  const valid = ['Asep', 'Slamet', 'Jono'];
  if (!valid.includes(packingTeam)) {
    return res.status(400).json({ message: 'Tim packing tidak valid' });
  }
  try {
    const updatedOrder = await OrderModel
      .findByIdAndUpdate(
        req.params.id,
        { packingTeam },
        { new: true }
      )
      .populate('user', 'name email')
      .populate('items.product', 'name brand priceGeneral')
      .exec();

    if (!updatedOrder) return res.status(404).json({ message: 'Order tidak ditemukan' });
    res.json(updatedOrder);
  } catch (err) {
    console.error('❌ Update packingTeam error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Daily summary per user dengan filter tanggal
router.get('/my/daily-summary', auth, async (req, res) => {
  try {
    const { start, end } = req.query;
    const match = { user: new mongoose.Types.ObjectId(req.user.id) };

    if (start || end) {
      match.createdAt = {};
      if (start) match.createdAt.$gte = new Date(start);
      if (end) match.createdAt.$lte = new Date(end);
    }

    const summary = await OrderModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          ordersCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          ordersCount: 1,
          totalRevenue: 1
        }
      }
    ]);
    res.json(summary);
  } catch (err) {
    console.error('❌ Daily summary error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat ambil summary' });
  }
});

router.get('/my/summary-insight', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    // Ambil data summary umum
    const totalOrders = await OrderModel.countDocuments({ user: userId, status: { $in: ['done', 'pending'] } });
    const doneOrders = await OrderModel.find({ user: userId, status: 'done' });

    // Hitung omset harian dan days
    const daily = await OrderModel.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId), status: 'done' } },
      { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          ordersCount: { $sum: 1 }
        }
      }
    ]);
    const totalDays = daily.length;
    const avgOrdersPerDay = totalDays ? (doneOrders.length / totalDays) : 0;

    res.json({ avgOrdersPerDay });
  } catch (err) {
    console.error('❌ GET /orders/my/summary-insight:', err);
    res.status(500).json({ error: err.message });
  }
});
export default router;
