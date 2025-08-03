import React, { useState, useEffect, useContext } from 'react';
import { Button, Pagination, ButtonGroup } from '@mui/material';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { PiExportBold } from 'react-icons/pi';
import { MdOutlineFilterAlt } from 'react-icons/md';
import { pdf } from '@react-pdf/renderer';
import { PDFDocument } from 'pdf-lib';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { AuthContext } from '../../Components/Auth/AuthContext';
import { MyContext } from '../../App';
import { OrderPdf } from './OrderPdf';

const ITEMS_PER_PAGE = 10;

export default function AdminOrders() {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base) console.error('⚠️ VITE_API_BASE_URL belum diset di .env');

  const { user } = useContext(AuthContext);
  const { setIsOpenFullScreenPanel } = useContext(MyContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [openDetailIdx, setOpenDetailIdx] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const [fReseller, setFReseller] = useState('');
  const [fStatus, setFStatus] = useState('');
  const [fPacking, setFPacking] = useState('');
  const [fFrom, setFFrom] = useState('');
  const [fTo, setFTo] = useState('');

  const [searchInput, setSearchInput] = useState('');
  const [searchQ, setSearchQ] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setSearchQ(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${base}/api/orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const list = await res.json();
        setOrders(Array.isArray(list) ? list : list.data || []);
      } catch (err) {
        console.error('Fetch orders failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [base]);

  const unique = arr => Array.from(new Set(arr.filter(v => v)));
  const resellers = unique(orders.map(o => o.user?.name));
  const packings = unique(orders.map(o => o.packingTeam));

  const filtered = orders.filter(o => {
    if (searchQ && !o._id.toLowerCase().includes(searchQ.toLowerCase())) return false;
    if (fReseller && o.user?.name !== fReseller) return false;
    if (fStatus && o.status !== fStatus) return false;
    if (fPacking && o.packingTeam !== fPacking) return false;
    const ordDate = new Date(o.createdAt).setHours(0, 0, 0, 0);
    if (fFrom && ordDate < new Date(fFrom).getTime()) return false;
    if (fTo && ordDate > new Date(fTo).getTime()) return false;
    return true;
  });

  const toggleOrderDetail = idx => setOpenDetailIdx(prev => (prev === idx ? null : idx));

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`${base}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Update status failed', err);
      return null;
    }
  };

  const handlePrintAll = async order => {
    if (!order.resiFile) return alert('Tidak ada file resi');
    setPrinting(true);
    try {
      const token = localStorage.getItem('token');
      const [resiBytes, pdfBlob] = await Promise.all([
        fetch(`${base}/uploads/${order.resiFile}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.arrayBuffer()),
        pdf(<OrderPdf order={order} />)
          .toBlob()
          .then(b => b.arrayBuffer())
      ]);
      const merged = await PDFDocument.create();
      const [resiDoc, dataDoc] = await Promise.all([
        PDFDocument.load(resiBytes),
        PDFDocument.load(pdfBlob)
      ]);
      const resiPages = await merged.copyPages(
        resiDoc,
        resiDoc.getPageIndices()
      );
      resiPages.forEach(p => merged.addPage(p));
      const dataPages = await merged.copyPages(
        dataDoc,
        dataDoc.getPageIndices()
      );
      dataPages.forEach(p => merged.addPage(p));
      const finalPdfBytes = await merged.save();
      const blobUrl = URL.createObjectURL(
        new Blob([finalPdfBytes], { type: 'application/pdf' })
      );
      const iframe = document.createElement('iframe');
      Object.assign(iframe.style, { position: 'fixed', width: '0', height: '0' });
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.onload = async () => {
        iframe.contentWindow.print();
        await updateOrderStatus(order._id, 'done');
        const fresh = await fetch(`${base}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json());
        setOrders(Array.isArray(fresh) ? fresh : fresh.data || []);
        document.body.removeChild(iframe);
        setPrinting(false);
      };
    } catch (err) {
      console.error('Print failed', err);
      alert('Gagal mencetak PDF');
      setPrinting(false);
    }
  };

  const handleResetStatus = async () => {
    if (openDetailIdx == null) return;
    const o = filtered[openDetailIdx];
    if (o && o.status === 'done') {
      await updateOrderStatus(o._id, 'pending');
      setOrders(prev =>
        prev.map(x =>
          x._id === o._id ? { ...x, status: 'pending' } : x
        )
      );
    }
  };

  const handlePackingChange = async (orderId, teamName) => {
    const updated = await fetch(`${base}/api/orders/${orderId}/packing`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ packingTeam: teamName })
    }).then(r => r.json());
    setOrders(prev =>
      prev.map(x => (x._id === orderId ? updated : x))
    );
  };

  const exportExcel = () => {
    const rows = [];
    filtered.forEach(o =>
      o.items.forEach(i => {
        rows.push({
          OrderID: o._id.slice(-6),
          Reseller: o.user?.name,
          Status: o.status,
          Packing: o.packingTeam,
          Items: i.product?.name,
          Qty: i.qty,
          'Harga Satuan': i.price,
          'Total Harga': i.price * i.qty,
          Tanggal: new Date(o.createdAt).toLocaleDateString('id-ID'),
          Catatan: i.note || ''
        });
      })
    );
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    const buf = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array'
    });
    saveAs(
      new Blob([buf], { type: 'application/octet-stream' }),
      `orders_${Date.now()}.xlsx`
    );
  };

  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pagedOrders = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-white shadow-sm rounded">
        <h2 className="font-bold">Data Pesanan Admin</h2>
        <div className="flex items-center gap-3">
          <input
            placeholder="Search ID…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="px-2 py-1 border rounded"
          />
          <Button
            color="primary"
            variant="contained"
            onClick={exportExcel}
            startIcon={<PiExportBold />}
          >
            Export Excel
          </Button>
          <Button
            color="success"
            variant="contained"
            onClick={() => setShowFilter(show => !show)}
            startIcon={<MdOutlineFilterAlt />}
          >
            Filter By
          </Button>
        </div>
      </div>

      {showFilter && (
        <div className="p-4 bg-gray-50 rounded space-y-2">
          <select
            value={fReseller}
            onChange={e => setFReseller(e.target.value)}
            className="px-2 py-1 border rounded w-60"
          >
            <option value="">Semua Reseller</option>
            {resellers.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            value={fStatus}
            onChange={e => setFStatus(e.target.value)}
            className="px-2 py-1 border rounded w-40"
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="done">Selesai</option>
          </select>
          <select
            value={fPacking}
            onChange={e => setFPacking(e.target.value)}
            className="px-2 py-1 border rounded w-48"
          >
            <option value="">Semua Packing Team</option>
            {packings.map(p => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <div className="flex space-x-2">
            <input
              type={fFrom ? 'date' : 'text'}
              placeholder="Dari"
              value={fFrom}
              onChange={e => setFFrom(e.target.value)}
              onFocus={e => (e.target.type = 'date')}
              onBlur={e => {
                if (!e.target.value) e.target.type = 'text';
              }}
              className="px-2 py-1 border rounded w-32"
            />
            <input
              type={fTo ? 'date' : 'text'}
              placeholder="Sampai"
              value={fTo}
              onChange={e => setFTo(e.target.value)}
              onFocus={e => (e.target.type = 'date')}
              onBlur={e => {
                if (!e.target.value) e.target.type = 'text';
              }}
              className="px-2 py-1 border rounded w-32"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm table-auto border-collapse">
          <thead>
            <tr className="bg-gray-600 text-gray-200 text-xs uppercase tracking-wide border-b">
              <th className="px-3 py-2 text-center">Detail</th>
              <th className="px-3 py-2 text-center">ID Pesanan</th>
              <th className="px-3 py-2 text-center">Reseller</th>
              <th className="px-3 py-2 text-center">Status</th>
              <th className="px-3 py-2 text-center">Packing</th>
              <th className="px-3 py-2 text-center">Jumlah Item</th>
              <th className="px-3 py-2 text-center">Total Harga</th>
              <th className="px-3 py-2 text-center">Tanggal</th>
              <th className="px-3 py-2 text-center">Resi</th>
              <th className="px-3 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center p-8">
                  Loading…
                </td>
              </tr>
            ) : pagedOrders.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center p-8">
                  Kosong
                </td>
              </tr>
            ) : (
              pagedOrders.map((o, idx) => {
                const isEven = idx % 2 === 0;
                const rowBgColor = isEven ? 'bg-white' : 'bg-gray-200';
                const detailBgColor = isEven ? 'bg-gray-50' : 'bg-white';
                return (
                  <React.Fragment key={o._id}>
                    {/* Baris utama */}
                    <tr
                      className={`border-b hover:bg-gray-300 transition duration-150 ${rowBgColor}`}
                    >
                      <td className="px-3 py-2 text-center">
                        <Button
                          className="!min-w-[30px] !min-h-[30px] bg-gray-200 rounded-full p-0"
                          onClick={() => toggleOrderDetail(idx)}
                        >
                          {openDetailIdx === idx ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </Button>
                      </td>
                      <td className="px-3 py-2 font-mono text-gray-800 text-center">
                        {o._id.slice(-6)}
                      </td>
                      <td className="px-3 py-2">{o.user?.name}</td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            o.status === 'done'
                              ? 'bg-green-500 text-white'
                              : 'bg-red-400 text-white'
                          }`}
                        >
                          {o.status === 'done' ? 'Selesai' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <select
                          value={o.packingTeam || ''}
                          onChange={e =>
                            handlePackingChange(o._id, e.target.value)
                          }
                          className="border px-1 py-1 rounded text-sm max-w-[6rem]"
                        >
                          <option value="" disabled>
                            Pilih Tim
                          </option>
                          {packings.map(t => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2 text-center">
                        {o.items.length}
                      </td>
                      <td className="px-3 py-2 font-semibold text-green-700 text-center">
                        Rp. {o.totalPrice.toLocaleString('id-ID')}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {new Date(o.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {o.resiFile ? (
                          <a
                            href={`${base}/uploads/${o.resiFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Lihat Resi
                          </a>
                        ) : (
                          '–'
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <ButtonGroup variant="contained" size="small">
                          <button
                            disabled={o.status !== 'done' || printing}
                            onClick={handleResetStatus}
                            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white"
                          >
                            Reset
                          </button>
                          <button
                            disabled={printing}
                            onClick={() => handlePrintAll(o)}
                            className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white"
                          >
                            {printing ? 'Mencetak...' : 'Print'}
                          </button>
                        </ButtonGroup>
                      </td>
                    </tr>

                    {/* Detail row (jika dibuka) */}
                    {openDetailIdx === idx && (
                      <tr className={detailBgColor}>
                        <td colSpan={10} className="px-6 py-4">
                          <table className="w-full text-xs table-auto border border-gray-200 rounded shadow-sm">
                            <thead className="bg-gray-100 text-gray-700">
                              <tr className="text-left">
                                <th className="px-2 py-1">No</th>
                                <th className="px-2 py-1">Produk</th>
                                <th className="px-2 py-1">Motor</th>
                                <th className="px-2 py-1">Varian</th>
                                <th className="px-2 py-1">Qty</th>
                                <th className="px-2 py-1">Harga</th>
                                <th className="px-2 py-1">Total</th>
                                <th className="px-2 py-1">Catatan</th>
                              </tr>
                            </thead>
                            <tbody>
                              {o.items.map((it, j) => (
                                <tr key={j} className="border-t border-gray-200">
                                  <td className="px-2 py-1">{j + 1}</td>
                                  <td className="px-2 py-1">{it.product?.name}</td>
                                  <td className="px-2 py-1">{it.merkLabel}</td>
                                  <td className="px-2 py-1">{it.variantLabel}</td>
                                  <td className="px-2 py-1">{it.qty}</td>
                                  <td className="px-2 py-1">
                                    Rp. {it.price?.toLocaleString('id-ID')}
                                  </td>
                                  <td className="px-2 py-1">
                                    Rp. {(it.price * it.qty)?.toLocaleString('id-ID')}
                                  </td>
                                  <td className="px-2 py-1">{it.note || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
        {!loading && filtered.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center p-4">
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, n) => setPage(n)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
