import express from 'express';
import { addProductController, getProductById } from '../controllers/product.controller.js';
import ProductModel from '../models/product.model.js';
import OrderModel from '../models/order.model.js'; // tambahkan import Order model jika diperlukan

const router = express.Router();

// Endpoint utama: ambil semua produk
router.get('/', async (req, res) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data produk' });
  }
});

// Endpoint hitung total produk terjual per produk
router.get('/sold', async (_req, res) => {
  try {
    const soldAgg = await OrderModel.aggregate([
      { $match: { status: "done" } },  // hanya pesanan selesai
      { $unwind: "$items" },
      { $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.qty" }
        }
      }
    ]);
    const map = {};
    soldAgg.forEach(r => { map[r._id.toString()] = r.totalSold });
    res.json(map);
  } catch (err) {
    res.status(500).json({ message: 'Gagal hitung total sold', error: err.message });
  }
});

router.get('/sold-per-variant', async (_req, res) => {
  try {
    const soldVar = await OrderModel.aggregate([
      { $match: { status: "done" } },
      { $unwind: "$items" },
      { $group: {
          _id: {
            productId: "$items.product",
            kodeMotor: "$items.merkLabel",
            variant: "$items.variantLabel"
          },
          qty: { $sum: "$items.qty" }
        }
      }
    ]);
    const map = {};
    soldVar.forEach(r => {
      const pid = r._id.productId.toString();
      const motor = r._id.kodeMotor;
      const variant = r._id.variant;
      if (!map[pid]) map[pid] = {};
      if (!map[pid][motor]) map[pid][motor] = {};
      map[pid][motor][variant] = r.qty;
    });
    res.json(map);
  } catch (err) {
    res.status(500).json({ message: 'Gagal hitung per varian', error: err.message });
  }
});

router.get('/count', async (_req, res) => {
  try {
    const total = await ProductModel.countDocuments();
    res.status(200).json({ total });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mendapatkan total produk' });
  }
});

router.get('/:id', getProductById);

// Endpoint POST tambah produk
router.post('/', addProductController);

router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
