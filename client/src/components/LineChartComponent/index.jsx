import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = {
  pesanan: "#2563eb",
  produk: "#22c55e",
  omset: "#a855f7",
  pending: "#ef4444"
};

const LABELS = {
  pesanan: "Total Pesanan",
  produk: "Produk Terjual",
  omset: "Total Omset",
  pending: "Pesanan Pending"
};

const LineChartComponent = ({ data = [], selectedMetrics = [] }) => {
  if (!Array.isArray(data)) {
    return <p className="text-red-500">Data chart tidak valid.</p>;
  }

  if (data.length === 0) {
    return <p className="text-gray-500 italic">Belum ada data untuk periode ini.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => {
          // Format angka atau rupiah jika omset
          return typeof value === "number"
            ? new Intl.NumberFormat('id-ID').format(value)
            : value;
        }} />
        <Legend />
        {selectedMetrics.map((metric) => (
  <Line
    key={metric}
    type="monotone"
    dataKey={metric}
    stroke={COLORS[metric]}
    dot={false}
  />
))}

      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
