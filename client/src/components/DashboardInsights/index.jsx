import React from 'react';

const DashboardInsights = ({ topProducts = [], recentOrders = [], stats = {} }) => {
  return (
    <div className="overflow-x-auto flex gap-4 pb-2 mt-5">
      {/* Produk Terlaris */}
      <div className="min-w-[300px] bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">📦 Produk Terlaris</h3>
        {topProducts.length > 0 ? (
          topProducts.map((item, i) => (
            <div key={i} className="text-sm border-b py-1 flex justify-between">
              <span>{item.name}</span>
              <span className="font-medium">{item.qty}x</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">Belum ada data</p>
        )}
      </div>

      {/* Pesanan Terbaru */}
      <div className="min-w-[300px] bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">🧾 Pesanan Terbaru</h3>
        {recentOrders.length > 0 ? (
          recentOrders.map((order, i) => (
            <div key={i} className="text-sm border-b py-1">
              <div className="font-medium">{order.customer}</div>
              <div className="text-xs text-gray-500">{order.date}</div>
              <div className="text-xs">{order.total} • {order.status}</div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">Belum ada pesanan</p>
        )}
      </div>

      {/* Performa Mingguan */}
      <div className="min-w-[300px] bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">📊 Performa Mingguan</h3>
        <ul className="text-sm space-y-1">
          <li>📦 Total Produk: <strong>{stats.totalProduk ?? 0}</strong></li>
          <li>🛒 Total Order: <strong>{stats.totalOrder ?? 0}</strong></li>
          <li>
            💰 Total Omset: <strong>
              Rp {(stats.omset ?? 0).toLocaleString('id-ID')}
            </strong>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardInsights;
