import express from 'express';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware.js';
import User from '../models/user.model.js';

const router = express.Router();

router.get('/panel', authMiddleware, isAdmin, (_req, res) => {
  res.json({ message: 'Selamat datang di Admin Panel!' });
});

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find(); // model User
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// PATCH untuk toggle status active
router.patch('/users/:id/toggle', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    user.active = !user.active;
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
