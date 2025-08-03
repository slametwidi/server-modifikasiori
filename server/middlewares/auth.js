// server/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export default async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token dibutuhkan atau format Bearer salah' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }
    req.user = user;  // objek lengkap user, termasuk .role
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Token tidak valid' });
  }
}
