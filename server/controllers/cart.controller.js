import Cart from '../models/cart.model.js';

export const addToCart = async (req, res) => {
  try {
    const { productId, variantIndex, qty, quantity, note } = req.body;
    const userId = req.user._id; // pastikan middleware auth hantar user
    // Bisa cek duplikat: kalau user+product+variant ada, tinggal update qty
    let cartItem = new Cart({ userId, productId, variantIndex, qty, note });
    cartItem = await cartItem.save();
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const items = await Cart.find({ userId }).populate('productId');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
