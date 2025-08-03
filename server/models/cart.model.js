import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantIndex: Number,
    variantLabel: String,
    merkLabel: String,
    qty: { type: Number, default: 1 },                    // ganti dari quantity
    note: String,
  }],
}, { timestamps: true });

export default mongoose.model('Cart', CartSchema);
