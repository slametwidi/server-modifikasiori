import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  kategori: { type: String, required: true },
  merk: { type: [String], default: [] },
  motors: { type: [String], default: [] },
  variants: { type: [String], default: [] },
  images: { type: [String], default: [] } // nama file
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
