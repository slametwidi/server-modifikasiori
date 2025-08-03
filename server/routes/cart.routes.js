import express from 'express';
import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Tambah produk ke cart
router.post('/', auth, async (req, res) => {
  try {
    console.log('=== ADD TO CART REQUEST ===');
    console.log('Headers:', req.headers);
    console.log('req.body:', req.body);
    console.log('req.body', req.body);
    const { productId, variantIndex, variantLabel, merkLabel, qty, note } = req.body;
    const userId = req.user.id;

    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    // 🔹 Deklarasikan variabel cart SEBELUM digunakan
    let cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      cart = new CartModel({ user: userId, products: [] });
    }

    // 🔹 Logika update atau tambahkan item
    const exist = cart.products.find(p =>
      p.productId.equals(productId) &&
      p.variantIndex === variantIndex &&
      p.variantLabel === variantLabel
    );

    if (exist) {
      exist.qty += qty;
      exist.note = note;
    } else {
      cart.products.push({ productId, variantIndex, variantLabel, merkLabel, qty: qty, note });
    }

    // 🔹 Simpan dan kirim response
    await cart.save();
    const populated = await cart.populate('products.productId');
    res.status(200).json(populated);

  } catch (err) {
    console.error('Error saat add-to-cart:', err);
    res.status(500).json({
      message: 'Server error saat menambahkan ke cart',
      detail: err.message
    });
  }
});

// Ambil isi cart
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  let cart = await CartModel.findOne({ user: userId }).populate('products.productId');
  if (!cart) return res.json({ user: userId, products: [] });

  // Urutkan berdasarkan ObjectId terbaru (timestamp)
  cart.products.sort((a, b) => {
    return b._id.getTimestamp() - a._id.getTimestamp();
  });

  res.json(cart);
});


// Update/hapus item
router.put('/', auth, async (req, res) => {
  const { productId, variantIndex, quantity, note } = req.body;
  const userId = req.user.id;

  const cart = await CartModel.findOne({ user: userId });
  if (!cart) return res.status(404).json({ message: 'Cart tidak ditemukan' });

  const idx = cart.products.findIndex(p =>
    p.productId.equals(productId) && p.variantIndex === variantIndex
  );
  if (idx === -1) return res.status(404).json({ message: 'Item tidak ditemukan' });

  if (quantity > 0) {
    cart.products[idx].quantity = quantity;
    cart.products[idx].note = note;
  } else {
    cart.products.splice(idx, 1);
  }

  await cart.save();
  const updated = await cart.populate('products.productId');
  res.status(200).json(updated);
});

// Kosongkan cart
router.delete('/:userId', auth, async (req, res) => {
  if (req.user.id !== req.params.userId) return res.status(403).json({ message: 'Akses ditolak' });

  await CartModel.findOneAndDelete({ user: req.params.userId });
  res.status(200).json({ message: 'Cart berhasil dikosongkan' });
});

export default router;
