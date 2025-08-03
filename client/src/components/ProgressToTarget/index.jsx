import React, { useState, useEffect } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';

const ProgressToTarget = ({
  title = "Progress Omset Bulanan",
  bannerTitle = "Tips Penjualan",
  bannerImageUrl,
  bannerText,
  target,
  formatCurrency
}) => {
  const [revenue, setRevenue] = useState(0);
  const percent = Math.min(100, Math.round((revenue / target) * 100));

  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
  if (!base) console.warn('⚠️ VITE_API_BASE_URL belum didefinisikan di file .env');

  useEffect(() => {
    fetch(`${base}/api/orders/my/summary`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Fetch failed');
        return res.json();
      })
      .then(data => {
        setRevenue(Number(data.totalRevenue) || 0);
      })
      .catch(err => console.error('Summary fetch error:', err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-2">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Banner section */}
        <div className="md:col-span-4 space-y-3">
          <h3 className="text-lg font-semibold">{bannerTitle}</h3>
          {bannerImageUrl && (
            <img
              src={bannerImageUrl}
              alt={bannerTitle}
              className="rounded-md w-full object-cover"
              style={{ maxHeight: 160 }}
            />
          )}
          {bannerText && (
            <p className="text-sm text-gray-700">{bannerText}</p>
          )}
        </div>

        {/* Progress section */}
        <motion.div
          className="flex flex-col items-center justify-center h-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-sm font-semibold mb-2 text-center">{title}</h2>
          <div style={{ width: 120, height: 120 }}>
            <CircularProgressbarWithChildren
              value={percent}
              styles={buildStyles({
                pathColor: percent >= 80 ? "#10b981"
                  : percent >= 50 ? "#f59e0b"
                  : "#ef4444",
                trailColor: "#eee",
                strokeLinecap: "round",
                textColor: "#333",
              })}
            >
              <motion.div
                key={percent}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{percent}%</div>
              </motion.div>
            </CircularProgressbarWithChildren>
          </div>
          <div className="mt-3 text-center font-medium">
            {formatCurrency(revenue)} / {formatCurrency(target)}
          </div>
        </motion.div>
      </div>

      {percent >= 100 && (
        <div className="text-green-600 mt-4 font-medium text-center">
          🎉 Target tercapai!
        </div>
      )}
    </div>
  );
};

export default ProgressToTarget;
