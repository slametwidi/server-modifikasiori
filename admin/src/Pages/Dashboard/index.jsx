// src/pages/Dashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Checkbox,
  Tooltip,
  Pagination,
} from "@mui/material";
import {
  MdAddToPhotos,
  MdOutlineFilterAlt,
} from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { IoEyeOutline, IoTrashOutline } from "react-icons/io5";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { PiExportBold } from "react-icons/pi";
import DashboardBoxes from "../../Components/DashboardBoxes";
import Badge from "../../components/Badge";
import { MyContext } from "../../App";
import { AuthContext } from "../../Components/Auth/AuthContext";
import { pdf } from "@react-pdf/renderer";
import { PDFDocument } from "pdf-lib";
import { OrderPdf } from "../Orders/OrderPdf";

const ITEMS_PER_PAGE = 10;

// Direct default export → tidak perlu `export default Dashboard;` di akhir
export default function Dashboard() {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base) console.error("VITE_API_BASE_URL belum diset di .env");

  const { user } = useContext(AuthContext);
  const { setIsOpenFullScreenPanel } = useContext(MyContext);

  const [products, setProducts] = useState([]);
  const [salesMap, setSalesMap] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [page, setPage] = useState(1);
  const [isOpenOrderProduct, setIsOpenOrderProduct] = useState(null);

  // Fetch products dan jumlah terjual
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${base}/api/products`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : data.data || []))
      .catch((err) => console.error("Fetch products error:", err))
      .finally(() => setLoadingProducts(false));

    fetch(`${base}/api/products/sold`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((map) => setSalesMap(map))
      .catch((err) => console.error("Fetch sold error:", err));
  }, [base]);

  // Fetch order, urutkan terbaru
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${base}/api/orders`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((list) => {
        const arr = Array.isArray(list) ? list : list.data || [];
        setOrders(arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      })
      .catch((err) => console.error("Fetch orders error:", err))
      .finally(() => setLoadingOrders(false));
  }, [base]);

  const toggleOrderDetail = (i) =>
    setIsOpenOrderProduct((prev) => (prev === i ? null : i));

  const handlePrintAll = async (order) => {
    const token = localStorage.getItem("token");
    try {
      const resiBytes = await fetch(`${base}/uploads/${order.resiFile}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.arrayBuffer();
      });

      const docBlob = await pdf(<OrderPdf order={order} />).toBlob();
      const orderBytes = await docBlob.arrayBuffer();
      const mergedDoc = await PDFDocument.create();
      const [resiDoc, dataDoc] = await Promise.all([
        PDFDocument.load(resiBytes),
        PDFDocument.load(orderBytes),
      ]);
      const resiPages = await mergedDoc.copyPages(
        resiDoc,
        resiDoc.getPageIndices()
      );
      resiPages.forEach((p) => mergedDoc.addPage(p));
      const dataPages = await mergedDoc.copyPages(
        dataDoc,
        dataDoc.getPageIndices()
      );
      dataPages.forEach((p) => mergedDoc.addPage(p));
      const mergedBytes = await mergedDoc.save();
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      Object.assign(iframe.style, { position: "fixed", width: 0, height: 0 });
      iframe.src = blobUrl;
      iframe.onload = () => iframe.contentWindow.print();
      document.body.appendChild(iframe);
    } catch (err) {
      console.error("Print error:", err);
      alert(`Gagal mencetak PDF: ${err.message}`);
    }
  };

  // slice untuk pagination
  const pageCount = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE));
  const shownOrders = orders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="w-full bg-white py-2 px-6 rounded-md shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold leading-tight">
            Selamat Datang, <br />
            {user?.name || "Modifikasi Ori"}
          </h1>
          <p>Statistik toko Anda hari ini</p>
        </div>
        <img src="/logo1.png" alt="Logo" className="w-32" />
      </div>

      <DashboardBoxes />

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow py-4">
        <div className="px-6 flex justify-between items-center mb-4">
          <h2 className="font-bold">Data Produk</h2>
          <div className="flex gap-3">
            <Button variant="contained" color="primary" startIcon={<PiExportBold />}>
              Export Data
            </Button>
            <Button variant="contained" color="success" startIcon={<MdOutlineFilterAlt />}>
              Filter By
            </Button>
          </div>
        </div>
        {loadingProducts ? (
          <p className="px-6">Loading produk...</p>
        ) : (
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">NO</th>
                <th className="p-2">PRODUK</th>
                <th className="p-2">MERK</th>
                <th className="p-2">TERJUAL</th>
              </tr>
            </thead>
            <tbody className="">
              {products.map((item, i) => (
                <tr key={item._id || i} className="odd:bg-white even:bg-gray-50 border-t">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2 flex items-center gap-3">
                    <img
                      src={item.images?.[0] || "/no-image.png"}
                      alt={item.name}
                      className="w-16 h-10 object-cover rounded"
                    />
                    <span>{item.name}</span>
                  </td>
                  <td className="px-4 py-2">{item.brand}</td>
                  <td className="px-4 py-2">{salesMap[item._id] || 0} Pcs</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow py-4">
        <div className="px-6 flex justify-between items-center mb-4">
          <h2 className="font-bold">Data Pesanan</h2>
          <div className="flex gap-3">
            <Button variant="contained" color="primary" startIcon={<PiExportBold />}>
              Export Orders
            </Button>
            <Button variant="contained" color="success" startIcon={<MdOutlineFilterAlt />}>
              Filter By
            </Button>
          </div>
        </div>
        {loadingOrders ? (
          <p className="px-6">Loading pesanan...</p>
        ) : (
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-center">Detail</th>
                <th className="p-2 text-center">ID</th>
                <th className="p-2 text-center">Reseller</th>
                <th className="p-2 text-center">Status</th>
                <th className="p-2 text-center">Bayar</th>
                <th className="p-2 text-center">Items</th>
                <th className="p-2 text-center">Total</th>
                <th className="p-2 text-center">Tanggal</th>
                <th className="p-2 text-center">Resi</th>
              </tr>
            </thead>
            <tbody>
              {shownOrders.map((order, i) => (
                <React.Fragment key={order._id}>
                  <tr className="border-t">
                    <td className="px-2 py-3 text-center">
                      <Button
                        onClick={() => toggleOrderDetail(i)}
                        className="!min-w-[30px] !min-h-[30px] bg-gray-200 rounded-full"
                      >
                        {isOpenOrderProduct === i ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </Button>
                    </td>
                    <td className="px-4 py-3 text-center">{order._id.slice(-6)}</td>
                    <td className="px-4 py-3 text-center">{order.user?.name}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge status={order.status === "done" ? "confirm" : "pending"} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge status={order.isPaid ? "confirm" : "pending"} />
                    </td>
                    <td className="px-4 py-3 text-center">{order.items.length}</td>
                    <td className="px-4 py-3 text-center">
                      Rp. {order.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {order.resiFile ? (
                        <a
                          href={`${base}/uploads/${order.resiFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600"
                        >
                          Lihat Resi
                        </a>
                      ) : (
                        <span className="text-gray-400">–</span>
                      )}
                    </td>
                  </tr>
                  {isOpenOrderProduct === i && (
                    <tr>
                      <td colSpan={9} className="bg-gray-50 px-6 py-4">
                        <table className="w-full text-sm text-left border">
                          <thead className="bg-gray-200">
                            <tr>
                              <th className="p-2">No</th>
                              <th className="p-2">Produk</th>
                              <th className="p-2">Merk</th>
                              <th className="p-2">Varian</th>
                              <th className="p-2">Qty</th>
                              <th className="p-2">Harga</th>
                              <th className="p-2">Total</th>
                              <th className="p-2">Catatan</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((it, idx) => (
                              <tr key={idx} className="border-t">
                                <td className="p-2">{idx + 1}</td>
                                <td className="p-2">{it.product?.name}</td>
                                <td className="p-2">{it.merkLabel}</td>
                                <td className="p-2">{it.variantLabel}</td>
                                <td className="p-2">{it.qty}</td>
                                <td className="p-2">
                                  Rp. {it.price.toLocaleString()}
                                </td>
                                <td className="p-2">
                                  Rp. {(it.price * it.qty).toLocaleString()}
                                </td>
                                <td className="p-2">{it.note || "–"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="mt-3">
                          <Button
                            variant="outlined"
                            onClick={() => handlePrintAll(order)}
                          >
                            Cetak Detail + Resi
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
        {!loadingOrders && orders.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center py-4">
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, n) => setPage(n)}
              showFirstButton
              showLastButton
            />
          </div>
        )}
      </div>
    </div>
  );
}
