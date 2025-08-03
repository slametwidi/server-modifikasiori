import Counter from '../models/counter.model.js';
import Invoice from '../models/invoice.model.js';

export async function getNextInvoiceId() {
  const doc = await Counter.findOneAndUpdate(
    { name: 'invoice' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const num = doc.seq.toString().padStart(3, '0');
  return `INV-${num}`;
}

export async function assignOrderToInvoice(userId, orderId, orderTotal) {
  let inv = await Invoice.findOne({ user: userId, status: 'pending' });
  if (!inv) {
    const invoiceId = await getNextInvoiceId();
    inv = new Invoice({
      invoiceId,
      user: userId,
      orderIds: [],
      totalAmount: 0,
      paidAmount: 0,
      status: 'pending',
      generatedAt: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      history: [{ action: 'generated', by: 'system', timestamp: new Date() }]
    });
  }
  inv.orderIds.push(orderId);
  inv.totalAmount += orderTotal;
  inv.history.push({ action: 'order-added', by: 'system', timestamp: new Date() });
  await inv.save();
  return inv;
}
