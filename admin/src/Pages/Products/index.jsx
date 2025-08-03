// src/components/Products.jsx

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import xlsx from "json-as-xlsx";
import {
  Collapse,
  IconButton,
  Box,
  Button,
  Tooltip,
  Pagination
} from "@mui/material";
import {
  KeyboardArrowDown as ArrowDown,
  KeyboardArrowUp as ArrowUp
} from "@mui/icons-material";
import { MdOutlineAddBox } from "react-icons/md";
import { PiExportBold } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { IoTrashOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";

const ITEMS_PER_PAGE = 10;

export default function Products() {
  const { setIsOpenFullScreenPanel } = useContext(MyContext);
  const [products, setProducts] = useState([]);
  const [salesMap, setSalesMap] = useState({});
  const [soldVariantMap, setSoldVariantMap] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base) console.warn("⚠️ VITE_API_BASE_URL belum tersedia di lingkungan");

  const token = localStorage.getItem("token");
  const auth = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    let cancel; setLoading(true);
    axios.get(`${base}/api/products`, { headers: auth, cancelToken: new axios.CancelToken(c => (cancel = c)) })
      .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error("Fetch products error", err))
      .finally(() => setLoading(false));

    axios.get(`${base}/api/products/sold`, { headers: auth }).then(r => setSalesMap(r.data)).catch(err => console.error("Fetch sold", err));
    axios.get(`${base}/api/products/sold-per-variant`, { headers: auth }).then(r => setSoldVariantMap(r.data)).catch(err => console.error("Fetch sold-per-variant", err));

    return () => cancel?.();
  }, [base]);

  async function handleDelete(id) {
    if (!window.confirm("Yakin menghapus produk ini?")) return;
    try {
      await axios.delete(`${base}/api/products/${id}`, { headers: auth });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch {
      alert("Gagal hapus produk");
    }
  }

  function handleExport() {
    const data = [
      {
        sheet: "Produk",
        columns: [
          { label: "Nama Produk", value: "name" },
          { label: "Merk", value: "brand" },
          { label: "Terjual (pcs)", value: (row) => salesMap[row._id] || 0 },
          { label: "ID Produk", value: "_id" }
        ],
        content: products
      }
    ];
    xlsx(data, {
      fileName: "Data_Produk_" + new Date().toISOString().slice(0, 10),
      writeOptions: { bookType: "xlsx", type: "array" }
    });
  }

  const pageCount = Math.ceil(products.length / ITEMS_PER_PAGE);
  const visible = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="card bg-white shadow-md rounded-lg my-3">
      <div className="flex justify-between items-center p-5">
        <h1 className="font-bold text-xl">Data Produk Mod Ori</h1>
        <div className="flex gap-2">
          <Button
            variant="contained"
            color="primary"
            startIcon={<MdOutlineAddBox />}
            size="small"
            onClick={() => setIsOpenFullScreenPanel({ open: true, model: "Tambah Produk Baru" })}
          >
            Tambah
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<PiExportBold />}
            size="small"
            onClick={handleExport}
          >
            Export XLSX
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-800">
          <thead className="bg-gray-700 text-xs text-gray-300 uppercase">
            <tr>
              <th></th>
              <th className="px-6 py-3 text-center">Produk</th>
              <th className="px-6 py-3 text-center">Merk</th>
              <th className="px-6 py-3 text-center">Terjual</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <tr><td colSpan={5} className="text-center py-8">Loading…</td></tr>
              : visible.map((item, idx) => {
                  const open = expandedId === item._id;
                  const brands = item.motorBrands || [];
                  const sizes = item.sizes || {};
                  return (
                    <React.Fragment key={item._id}>
                      <tr className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-2 text-center">
                          <IconButton size="small" onClick={() => setExpandedId(open ? null : item._id)}>
                            {open ? <ArrowUp /> : <ArrowDown />}
                          </IconButton>
                        </td>
                        <td className="px-6 py-2">
                          <div className="flex items-center gap-4">
                            {item.images?.[0] ? (
                              <div className="w-14 h-14 overflow-hidden rounded">
                                <Link to={`/products/${item._id}`}><img src={item.images[0]} alt={item.name} className="object-cover w-full h-full scale-[1.05]"/></Link>
                              </div>
                            ) : null}
                            <Link to={`/products/${item._id}`}>
                              <h3 className="font-semibold text-lg hover:text-pink-500">{item.name}</h3>
                            </Link>
                          </div>
                        </td>
                        <td className="text-center">{item.brand || "-"}</td>
                        <td className="text-center">{salesMap[item._id] || 0} pcs</td>
                        <td className="px-6 py-2 text-center">
                          <div className="flex justify-center gap-2">
                            <Tooltip title="Edit">
                              <Button variant="outlined" size="small"><CiEdit /></Button>
                            </Tooltip>
                            <Tooltip title="Hapus">
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleDelete(item._id)}
                              >
                                <IoTrashOutline />
                              </Button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>

                      {open && (
                        <tr>
                          <td colSpan={5} className="p-0">
                            <Collapse in={open} timeout="auto" unmountOnExit>
                              <Box className="m-4 border border-gray-200 rounded overflow-x-auto">
                                <table className="w-full text-xs text-gray-700">
                                  <thead className="bg-gray-200">
                                    <tr>
                                      <th>No</th>
                                      <th>Kode Motor</th>
                                      <th>Variant</th>
                                      <th>Terjual</th>
                                      <th>HPP</th>
                                      <th>Reseller</th>
                                      <th>Umum</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {brands.flatMap((b, bi) =>
                                      Object.entries(sizes[b] || {}).map(([variant, vals], vi) => (
                                        <tr
                                          key={`${item._id}-${b}-${variant}`}
                                          className={((bi + vi) % 2 === 0) ? "bg-white" : "bg-gray-50"}
                                        >
                                          <td className="text-center">{vi === 0 ? bi + 1 : ""}</td>
                                          <td className="text-center">{vi === 0 ? b : ""}</td>
                                          <td className="text-center">{variant}</td>
                                          <td className="text-center">
                                            {(soldVariantMap[item._id]?.[b]?.[variant]) ?? 0}
                                          </td>
                                          <td className="text-center">{vals.hpp?.toLocaleString() ?? "-"}</td>
                                          <td className="text-center">{vals.reseller?.toLocaleString() ?? "-"}</td>
                                          <td className="text-center">{vals.umum?.toLocaleString() ?? "-"}</td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </Box>
                            </Collapse>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
            }
          </tbody>
        </table>
      </div>

      {!loading && pageCount > 1 && (
        <Box className="flex justify-center py-4">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, n) => setPage(n)}
          />
        </Box>
      )}
    </div>
  );
}
