import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function loginController(req, res) {
  console.log('Body login:', req.body);
  const { email, password } = req.body;

  // Cek email exist
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Email tidak ditemukan' });

  // Validasi password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Password salah' });

  // Generate JWT dengan role
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // Kirim kembali token dan data pengguna tanpa password
  res.json({
    token,
    user: { name: user.name, email: user.email, role: user.role }
  });
}
