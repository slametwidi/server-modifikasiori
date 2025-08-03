import cron from 'node-cron';
import { generateInvoicesForAll } from '../services/orderService.js';

export function scheduleWeeklyInvoices() {
  const cronExpr = '10 4 * * 4';  // Minggu jam 00:00 UTC atau lokal

  if (!cron.validate(cronExpr)) {
    console.warn('⚠️ Cron expression tidak valid:', cronExpr);
  }

  cron.schedule(cronExpr, async () => {
    console.log('🧾 Scheduler started: generate weekly invoices');
    try {
      const invoices = await generateInvoicesForAll();
      console.log(`✅ ${invoices.length} invoices generated successfully`);
    } catch (error) {
      console.error('❌ Invoice scheduler failed:', error);
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Jakarta'
  });
}
