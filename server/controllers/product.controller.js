import ProductModel from '../models/product.model.js';

// Tambahkan produk baru
export async function addProductController(req, res) {
  try {
    const newProd = await ProductModel.create(req.body);
    res.status(201).json(newProd);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Ambil semua produk (opsional, kalau kamu butuh listing)
export async function getAllProducts(req, res) {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Ambil produk berdasarkan ID
export async function getProductById(req, res) {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
