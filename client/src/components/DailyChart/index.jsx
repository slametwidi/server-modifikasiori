import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts';
import { FaShoppingCart, FaMoneyBillWave, FaStar, FaCalendarDay } from 'react-icons/fa';

const formatCurrency = v => {
  if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(1)} jt`;
  if (v >= 1_000) return `Rp ${(v / 1_000).toFixed(0)} rb`;
  return `Rp ${v.toLocaleString('id-ID')}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: 10 }}>
      <strong>{label}</strong>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.stroke }}>
          {p.name}: {p.dataKey === 'revenue'
            ? formatCurrency(p.value)
            : p.value.toLocaleString('id-ID')}
        </div>
      ))}
    </div>
  );
};

const DailyChartWithInsights = () => {
  const [data, setData] = useState([]);
  const [insight, setInsight] = useState(null);

  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
  if (!base) console.warn('⚠️ VITE_API_BASE_URL belum didefinisikan di file .env');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`${base}/api/orders/my/daily-summary`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const arr = Array.isArray(res.data) ? res.data : [];

      const mapped = arr.map(item => ({
        date: item.date,
        orders: item.ordersCount,
        revenue: item.totalRevenue
      }));

      mapped.sort((a, b) => new Date(a.date) - new Date(b.date));
      setData(mapped);

      if (mapped.length) {
        const totalOrders = mapped.reduce((sum, d) => sum + d.orders, 0);
        const totalRevenue = mapped.reduce((sum, d) => sum + d.revenue, 0);
        const avgOrders = Math.round(totalOrders / mapped.length);
        const avgRevenue = totalRevenue / mapped.length;
        const bestDay = mapped.reduce((a, b) => a.revenue > b.revenue ? a : b)?.date;

        axios.get(`${base}/api/orders/my/top-product`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(productRes => {
          console.log('productRes.data', productRes.data);
          const { name, totalQty } = productRes.data || {};
          const topProduct = name ? `${name}: ${totalQty} pcs` : '—';
          setInsight({
            avgOrders,
            avgRevenueFormatted: formatCurrency(avgRevenue),
            bestDay,
            topProduct
          });
        }).catch(() => {
          setInsight({
            avgOrders,
            avgRevenueFormatted: formatCurrency(avgRevenue),
            bestDay,
            topProduct: '—'
          });
        });
      }
    }).catch(err => {
      console.error('❌ Error ambil daily summary:', err);
    });
  }, []);

  return (
    <div className="bg-gray-100 rounded-lg">
      <div className="bg-white p-6 rounded-lg">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis
              dataKey="date"
              tickFormatter={d => d.slice(5)}
              angle={-45}
              textAnchor="end"
              height={50}
              padding={{ left: 20, right: 20 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              width={60}
              tick={{ fontSize: 12 }}
              domain={['auto', 'dataMax + 1']}
              tickFormatter={v => v.toLocaleString('id-ID')}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              width={80}
              tick={{ fontSize: 12 }}
              domain={['auto', 'dataMax * 1.1']}
              tickFormatter={v => formatCurrency(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" />
            <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#3872fa" name="Pesanan" dot />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#7928ca" name="Omset" dot />
          </LineChart>
        </ResponsiveContainer>

        {insight && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2 bg-gray-50 p-5 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium mb-3">Informasi Singkat</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2"><FaShoppingCart /> Rata-rata Pesanan: <strong>{insight.avgOrders}</strong></div>
                <div className="flex items-center gap-2"><FaMoneyBillWave /> Rata-rata Omset: <strong>{insight.avgRevenueFormatted}</strong></div>
                <div className="flex items-center gap-2"><FaCalendarDay /> Omset Tertinggi: <strong>{insight.bestDay}</strong></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <FaStar className="text-yellow-500" /> Produk Terlaris
              </h3>
              <p className="text-xl font-semibold">{insight.topProduct}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyChartWithInsights;
