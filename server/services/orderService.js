// services/orderService.js
import User from '../models/user.model.js';
import Order from '../models/order.model.js';
import Invoice from '../models/invoice.model.js';
import mongoose from 'mongoose';

// Fungsi untuk generate invoice mingguan via cron
export async function generateInvoicesForAll() {
  const users = await User.find({ role: 'reseller' });
  console.log('🔍 Found reseller users:', users.length);

  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  console.log('Rentang waktu invoice:', start.toISOString(), '–', end.toISOString());

  const invoices = [];
  for (const user of users) {
    const orders = await Order.find({
      user: user._id,
      createdAt: { $gte: start, $lte: end },
      isInvoiceGenerated: { $ne: true },
      isPaid: false,
      status: 'done'
    });
    if (orders.length === 0) continue;

    const total = orders.reduce((acc, o) => acc + o.totalPrice, 0);

    let invoice = await Invoice.findOne({
      user: user._id,
      status: 'pending',
      generatedAt: { $gte: start, $lte: end }
    });

    if (invoice) {
      invoice.orderIds.push(...orders.map(o => o._id));
      invoice.totalAmount += total;
      invoice.history.push({ action: 'orders-added', by: 'system', timestamp: now });
      await invoice.save();
    } else {
      invoice = await Invoice.create({
        invoiceId: `INV-${new mongoose.Types.ObjectId().toString().slice(-5)}`,
        user: user._id,
        orderIds: orders.map(o => o._id),
        totalAmount: total,
        paidAmount: 0,
        status: 'pending',
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        history: [{ action: 'generated', by: 'system', timestamp: now }],
        generatedAt: now
      });
    }
    invoices.push(invoice);

    await Order.updateMany(
      { _id: { $in: orders.map(o => o._id) } },
      { $set: { isInvoiceGenerated: true } }
    );
  }
  return invoices;
}

// Fungsi untuk generate invoice ketika satu order berubah status jadi 'done'
export async function generateInvoiceForOrder(order) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  let invoice = await Invoice.findOne({
    user: order.user,
    status: 'pending',
    generatedAt: { $gte: start, $lte: end }
  });

  if (invoice) {
    invoice.orderIds.push(order._id);
    invoice.totalAmount += order.totalPrice;
    invoice.history.push({ action: 'order-added', by: 'system', timestamp: now });
    await invoice.save();
  } else {
    invoice = await Invoice.create({
      invoiceId: `INV-${new mongoose.Types.ObjectId().toString().slice(-5)}`,
      user: order.user,
      orderIds: [order._id],
      totalAmount: order.totalPrice,
      paidAmount: 0,
      status: 'pending',
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      history: [{ action: 'generated', by: 'system', timestamp: now }],
      generatedAt: now
    });
  }

  order.isInvoiceGenerated = true;
  await order.save();
}

export async function getOrdersWithInvoiceStatus(filter = {}) {
  return Order.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: 'invoices',
        localField: '_id',
        foreignField: 'orderIds',
        as: 'invoices'
      }
    },
    {
      $addFields: {
        invoiceStatus: { $arrayElemAt: ['$invoices.status', 0] }
      }
    },
    {
      $project: {
        invoices: 0 // sembunyikan array invoice jika tidak perlu
      }
    }
  ]);
}