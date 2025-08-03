import React from 'react';
import { FaShoppingCart, FaMoneyBillWave, FaStar, FaCalendarDay } from 'react-icons/fa';

const InsightCards = ({ insight, formatCurrency }) => {
  const cards = [
    {
      title: 'Rata‑rata Pesanan /hari',
      // gunakan avgOrdersPerDay jika tersedia, fallback ke avgOrders
      value: insight.avgOrdersPerDay != null
        ? insight.avgOrdersPerDay.toFixed(1)
        : insight.avgOrders || 0,
      icon: <FaShoppingCart className="text-blue-500 text-2xl" />
    },
    {
      title: 'Rata‑rata Omset /hari',
      value: insight.avgRevenuePerDay != null
        ? formatCurrency(insight.avgRevenuePerDay)
        : formatCurrency(insight.avgRevenue || 0),
      icon: <FaMoneyBillWave className="text-green-500 text-2xl" />
    },
    {
      title: 'Produk Paling Laris',
      value: insight.topProductName || '—',
      sub: insight.topProductQty != null
        ? `(${insight.topProductQty} unit)`
        : null,
      icon: <FaStar className="text-yellow-500 text-2xl" />
    },
    {
      title: 'Hari Omset Tertinggi',
      value: insight.bestDay || '—',
      sub: insight.bestRevenue != null
        ? formatCurrency(insight.bestRevenue)
        : null,
      icon: <FaCalendarDay className="text-purple-500 text-2xl" />
    }
  ];

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map(card => (
        <div key={card.title}
             className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">{card.title}</h4>
            {card.icon}
          </div>
          <p className="text-3xl font-semibold text-gray-800">{card.value}</p>
          {card.sub && (
            <div className="mt-1 text-sm text-gray-500">{card.sub}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InsightCards;
