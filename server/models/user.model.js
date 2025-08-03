import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true, unique: true },
  password:{ type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin', 'accounting', 'reseller'],  // ← Pastikan 'admin' disertakan di sini
    default: 'user'
  },
  avatarUrl: { type: String, default: '' }
});

export default mongoose.model('User', userSchema);
