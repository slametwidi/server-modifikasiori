import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();
import UserModel from '../models/user.model.js';

async function seedUsers() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('🔌 Terhubung ke MongoDB');

  const usersToSeed = [
    { name: 'Tim Management', email: 'admin@manual.com', role: 'admin', pass: 'admin123' },
    { name: 'Power Maxx A', email: 'pma@manual.com', role: 'reseller', pass: 'pmamanual' },
    { name: 'Accounting', email: 'accounting@modifikasiori.com', role: 'accounting', pass: 'modifikasiori123' },
    { name: 'Slamet', email: 'slamet@modifikasiori.com', role: 'user', pass: 'slaymate04' },
  ];

  for (const u of usersToSeed) {
    const exists = await UserModel.findOne({ email: u.email });
    if (exists) {
      console.log(`✅ User ${u.email} sudah tersedia, dilewati`);
    } else {
      const hashed = await bcrypt.hash(u.pass, 10);
      await UserModel.create({
        name: u.name,
        email: u.email,
        password: hashed,
        role: u.role,
        active: true
      });
      console.log(`👍 User dibuat: ${u.email}`);
    }
  }

  await mongoose.disconnect();
  console.log('🌐 Seeder selesai, koneksi ditutup');
}

seedUsers()
  .then(_ => process.exit(0))
  .catch(err => {
    console.error('❌ Error seeding:', err);
    process.exit(1);
  });
