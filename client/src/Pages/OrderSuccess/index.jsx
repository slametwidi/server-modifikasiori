import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function OrderSuccess() {
  const { id } = useParams(); // Ambil ID dari URL: /order-success/:id
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
  if (!base) console.warn('⚠️ VITE_API_BASE_URL belum diset di .env');

  useEffect(() => {
    fetch(`${base}/api/orders/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setOrder(data.order || data);  // sesuaikan dengan response
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch order failed:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order tidak ditemukan.</div>;

  const totalItems = order.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">🎉 Pesanan Berhasil!</h1>
      <p>ID Pesanan: <strong>{order._id}</strong></p>
      <p>Tanggal: <strong>{new Date(order.createdAt).toLocaleString()}</strong></p>
      <p>Jumlah Item: <strong>{totalItems}</strong></p>
      <p>Total Bayar: <strong>Rp {order.totalPrice.toLocaleString()}</strong></p>

      <hr className="my-4" />
      <h2 className="font-semibold">Detail:</h2>
      <ul className="list-disc list-inside space-y-2">
        {order.items.map((item, i) => (
          <li key={i}>
            {item.variantLabel ? `${item.variantLabel} – ` : ''}
            Qty: {item.qty} × Rp {item.price.toLocaleString()}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex gap-4">
        <Link to="/orders">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Lihat Pesanan Saya
          </button>
        </Link>
        <Link to="/">
          <button className="px-4 py-2 border rounded">
            Kembali ke Home
          </button>
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
