import Category from '../models/category.model.js';
import fs from 'fs';
import path from 'path';

export const createCategory = async (req, res) => {
  try {
    const { kategori, merk, motors, variants, images } = req.body;
    const cat = await Category.create({
      kategori,
      merk: Array.isArray(merk) ? merk : [],
      motors: Array.isArray(motors) ? motors : [],
      variants: Array.isArray(variants) ? variants : [],
      images: Array.isArray(images) ? images : []
    });
    res.status(201).json({ message: 'Kategori berhasil dibuat', data: cat });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }
    res.json({ data: cat });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.limit) || 10;
    const total = await Category.countDocuments();
    const data = await Category.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.json({ total, page, perPage, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Kategori tidak ditemukan' });

    const { kategori, merk, motors, variants, removeImages } = req.body;

    // Update basic fields
    if (kategori) cat.kategori = kategori;
    if (merk) cat.merk = JSON.parse(merk);
    if (motors) cat.motors = JSON.parse(motors);
    if (variants) cat.variants = JSON.parse(variants);

    // Remove images
    if (removeImages) {
      const toRemove = JSON.parse(removeImages);
      cat.images = cat.images.filter(img => !toRemove.includes(img));
      toRemove.forEach(img => {
        const fullPath = path.join(process.cwd(), img);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    // Append new uploaded images
    if (req.files?.length > 0) {
      const uploaded = req.files.map(f => `/uploads/categories/${f.filename}`);
      cat.images = [...cat.images, ...uploaded];
    }

    // Mark modified fields (for mixed types)
    cat.markModified('merk');
    cat.markModified('motors');
    cat.markModified('variants');
    cat.markModified('images');

    const updated = await cat.save();
    res.json({ message: 'Kategori diperbarui', data: updated });
  } catch (err) {
    console.error('Error update category:', err);
    res.status(400).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Kategori tidak ditemukan' });

    cat.images.forEach(img => {
      const full = path.join(process.cwd(), img);
      if (fs.existsSync(full)) fs.unlinkSync(full);
    });
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
