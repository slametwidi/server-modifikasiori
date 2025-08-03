// index.js (server utama)
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDb.js';

import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import productRoutes from './routes/product.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import orderRouter from './controllers/order.controller.js';
import invoiceRoutes from './routes/invoice.routes.js';
import { scheduleWeeklyInvoices } from './cron/invoiceScheduler.js';
import categoryRoutes from './routes/category.routes.js';

dotenv.config();

const app = express();

// ✅ Dynamic CORS (dua origin + header + metode lengkap)
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || allowedOrigins[0]);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined'));
app.use(helmet({ crossOriginResourcePolicy: false }));

// 🎯 Daftarkan router
app.get('/', (_req, res) => {
  res.json({ message: `Server is running on port ${process.env.PORT}` });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/cart', cartRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/categories', categoryRoutes);

// Middleware global logger (optional, untuk debug)
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Pastikan router order dimasukkan setelah logger
app.use('/api/orders', orderRoutes);
app.use('/api/orders', orderRouter);

// 🔚 Wildcard fallback (harus paling akhir)
app.all('/*anything', (req, res) => {
  res.status(404).json({ message: `URL "${req.originalUrl}" tidak ditemukan` });
});

// 🚀 Jalankan server
connectDB().then(() => {
  scheduleWeeklyInvoices();
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server is running on port ${process.env.PORT}`);
  });
});


