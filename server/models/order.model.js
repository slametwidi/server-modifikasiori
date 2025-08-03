// models/order.model.js
import mongoose from 'mongoose';
import Invoice from '../models/invoice.model.js';
import { generateInvoiceForOrder } from '../services/orderService.js';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
      variantIndex: Number,
      variantLabel: String,
      merkLabel: String,
      qty: Number,
      price: Number,
      note: String
    }
  ],
  totalPrice: { type: Number, required: true },
  resiFile: String,
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  isInvoiceGenerated: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'done', 'cancelled'],
    default: 'pending'
  },
  packingTeam: { type: String, enum: ['Asep','Slamet','Jono'], default: null },
}, { timestamps: true });

// --- Middleware untuk post-save ---
orderSchema.post('save', async function(doc) {
  try {
    if (doc.status === 'done' && !doc.isInvoiceGenerated) {
      await generateInvoiceForOrder(doc);
    }
  } catch (err) {
    console.error('Middleware post-save generateInvoiceForOrder error:', err);
  }
});

// --- Middleware untuk post findOneAndUpdate ---
orderSchema.post('findOneAndUpdate', async function(result) {
  try {
    const doc = result;

    if (!doc) return;

    // Jika status berubah ke 'done' dan belum masuk invoice, maka generate invoice
    if (doc.status === 'done' && !doc.isInvoiceGenerated) {
      await generateInvoiceForOrder(doc);
    }

    // Jika status berubah dari 'done' ke status lain dan order sudah masuk invoice
    if (doc.status !== 'done' && doc.isInvoiceGenerated) {
      const invoice = await Invoice.findOne({ orderIds: doc._id });

      if (invoice) {
        invoice.orderIds.pull(doc._id);
        invoice.totalAmount -= doc.totalPrice;

        invoice.history.push({
          action: 'order-removed',
          by: 'system',
          timestamp: new Date(),
          note: 'Status order berubah dari done ke ' + doc.status
        });

        await invoice.save();
      }

      // Update flag di order
      await mongoose.model('Order').findByIdAndUpdate(doc._id, {
        isInvoiceGenerated: false
      });
    }

  } catch (err) {
    console.error('Middleware post-findOneAndUpdate error:', err);
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
