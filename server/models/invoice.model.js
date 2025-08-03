import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, unique: true, required: true },
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  orderIds: [{ type: mongoose.Types.ObjectId, ref: 'Order' }],
  totalAmount: { type: Number, required: true, default: 0 },
  paidAmount: { type: Number, required: true, default: 0 },
  paymentHistory: [{
    paidAmount: Number,
    proofFileUrl: String,
    paidAt: Date
  }],
  status: {
    type: String,
    enum: ['pending', 'processing', 'partial', 'paid', 'done'],
    default: 'pending'
  },
  proofFileUrls: [{ type: String }],
  generatedAt: { type: Date, default: Date.now },
  dueDate: Date,
  history: [
    {
      action: String,
      by: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
