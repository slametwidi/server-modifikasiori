import React, { useEffect, useState, useContext } from 'react';
import AccountSidebar from '../../components/AccountSidebar';
import { AuthContext } from '../../components/Auth/AuthContext';

const InvoiceDashboard = () => {
  const { user } = useContext(AuthContext);
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});
  const [modalInvoice, setModalInvoice] = useState(null);

  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
  if (!base) console.warn('⚠️ VITE_API_BASE_URL belum didefinisikan di file .env');

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch(`${base}/api/invoices`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        console.error('Fetch invoice error:', err);
      }
    })();
  }, [user]);

  const onPaySubmit = updatedInvoice => {
    setInvoices(prev => prev.map(inv => (inv._id === updatedInvoice._id ? updatedInvoice : inv)));
    setModalInvoice(null);
  };

  const handleDownload = invoice => {
    alert(`Download invoice ${invoice.invoiceId}`);
  };

  const filtered = invoices.filter(inv =>
    inv.user?.email === user.email &&
    (!search || inv.invoiceId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <section className="py-10 px-6 h-screen flex flex-col bg-gray-100">
      <div className="flex gap-5 flex-1 overflow-hidden">
        <aside className="w-1/5"><AccountSidebar /></aside>
        <main className="flex-1 p-6 overflow-auto bg-white rounded-md shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Dashboard Invoice & Pembayaran</h1>

          <div className="flex items-center mb-4 gap-2">
            <input
              type="search"
              placeholder="Cari Invoice ID…"
              className="ml-auto px-3 py-2 border rounded w-1/3"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-gray-900 text-white border border-gray-700">
              <thead className="bg-gray-800 text-gray-200">
                <tr>
                  <th className="p-3 text-center">▶</th>
                  <th className="p-3 text-left">Invoice ID</th>
                  <th className="p-3 text-right">Total Tagihan</th>
                  <th className="p-3 text-right">Sudah Dibayar</th>
                  <th className="p-3 text-right">Sisa Pembayaran</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm">
                {filtered.map(inv => {
                  const paid = inv.paidAmount || 0;
                  const total = inv.totalAmount || 0;
                  const due = Math.max(0, total - paid);

                  let btn;
                  if (inv.status === 'processing') {
                    btn = <button onClick={() => setModalInvoice(inv)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded">Bayar Tagihan</button>;
                  } else if (inv.status === 'partial') {
                    btn = <button onClick={() => setModalInvoice(inv)} className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1 rounded">Bayar Sisa Rp{due.toLocaleString('id-ID')}</button>;
                  } else if (inv.status === 'done') {
                    btn = <button onClick={() => handleDownload(inv)} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded">Download Invoice</button>;
                  } else {
                    btn = <button disabled className="bg-gray-500 text-gray-200 text-xs px-3 py-1 rounded">{inv.status === 'pending' ? 'Belum Jatuh Tempo' : 'Sedang di Proses'}</button>;
                  }

                  return (
                    <React.Fragment key={inv._id}>
                      <tr className="even:bg-gray-800 hover:bg-gray-700 border-b border-gray-700">
                        <td className="p-3 text-center">
                          <button onClick={() => setExpanded(prev => ({ ...prev, [inv._id]: !prev[inv._id] }))} className="text-indigo-400 hover:text-indigo-300">
                            {expanded[inv._id] ? '▲' : '▼'}
                          </button>
                        </td>
                        <td className="p-3">{inv.invoiceId}</td>
                        <td className="p-3 text-right">Rp{total.toLocaleString('id-ID')}</td>
                        <td className="p-3 text-right">Rp{paid.toLocaleString('id-ID')}</td>
                        <td className="p-3 text-right">Rp{due.toLocaleString('id-ID')}</td>
                        <td className="p-3 text-center capitalize">{inv.status}</td>
                        <td className="p-3 text-center">{btn}</td>
                      </tr>
                      {expanded[inv._id] && (
                        <tr>
                          <td colSpan="7" className="p-0">
                            <table className="w-full table-auto bg-gray-800 text-white text-sm">
                              <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                                <tr>
                                  <th className="px-4 py-2 text-center">Order ID</th>
                                  <th className="px-4 py-2 text-center">Items</th>
                                  <th className="px-4 py-2 text-center">Total Harga</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(inv.orderIds || []).map(o => {
                                  const total = (o.items || []).reduce((sum, it) => sum + (it.price * it.qty), 0);
                                  return (
                                    <tr key={o._id} className="even:bg-gray-700 hover:bg-gray-600">
                                      <td className="px-4 py-2 text-center">{o._id.slice(-6).toUpperCase()}</td>
                                      <td className="px-4 py-2 text-center">{o.items?.length || 0}</td>
                                      <td className="px-4 py-2 text-center font-mono">Rp{total.toLocaleString('id-ID')}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {modalInvoice && (
            <PaymentModal invoice={modalInvoice} onClose={() => setModalInvoice(null)} onSubmit={onPaySubmit} />
          )}
        </main>
      </div>
    </section>
  );
};

const PaymentModal = ({ invoice, onClose, onSubmit }) => {
  const [proof, setProof] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);

  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');

  useEffect(() => {
    const due = Math.max(0, (invoice.totalAmount || 0) - (invoice.paidAmount || 0));
    setPaidAmount(due);
  }, [invoice]);

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setProof(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!proof) return alert('Silakan upload bukti transfer.');
    setUploading(true);
    const form = new FormData();
    form.append('proof', proof);
    form.append('paidAmount', paidAmount);
    try {
      const res = await fetch(`${base}/api/invoices/${invoice._id}/upload-proof`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: form,
      });
      if (!res.ok) throw new Error('Upload gagal');
      const updated = await res.json();
      onSubmit(updated);
    } catch (err) {
      console.error(err);
      alert('Gagal upload bukti.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Bayar Sisa Rp{paidAmount.toLocaleString('id-ID')}</h3>
        <div className="mb-4">
          <label className="block mb-2">Upload Bukti Transfer</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="border rounded px-3 py-2 w-full" />
        </div>
        {previewURL && (
          <div className="mb-4">
            <p className="text-sm mb-1">Preview:</p>
            <img src={previewURL} alt="preview" className="w-24 h-24 object-cover cursor-pointer" onClick={() => window.open(previewURL, '_blank')} />
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded disabled:opacity-50" disabled={uploading}>Batal</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50" disabled={uploading}>
            {uploading ? 'Mengirim...' : 'Konfirmasi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDashboard;
