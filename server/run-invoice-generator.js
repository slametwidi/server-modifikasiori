// run-invoice-generator.js
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { generateInvoicesForAll } from './services/orderService.js';

async function run() {
  try {
    console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');
    const result = await generateInvoicesForAll();
    console.log(`✅ Generated invoices: ${result.length}`);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
