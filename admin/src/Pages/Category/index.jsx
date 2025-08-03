// src/pages/CategoryList.jsx

import React, { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import { Button, Checkbox, Pagination, Tooltip } from "@mui/material";
import { CiEdit } from "react-icons/ci";
import { IoEyeOutline, IoTrashOutline } from "react-icons/io5";

const ITEMS_PER_PAGE = 10;
const label = { inputProps: { "aria-label": "select all categories" } };

export default function CategoryList() {
  const { setIsOpenFullScreenPanel } = useContext(MyContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Controlled pagination state
  const [page, setPage] = useState(1);

  // Foundation: use .env => import.meta.env.VITE_API_BASE_URL
  const base = import.meta.env.VITE_API_BASE_URL;
  // Immediately show an error if the base URL is missing
  if (!base) {
    console.error("⚠️ VITE_API_BASE_URL belum diset di .env file (root folder)");
  }

  const fetchCategories = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    return fetch(`${base}/api/categories`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      mode: "cors"
    })
      .then(async (res) => {
        if (!res.ok) {
          const json = await res.json().catch(() => null);
          throw new Error(json?.message ?? `HTTP ${res.status}`);
        }
        const data = await res.json();
        return Array.isArray(data) ? data : data.data || [];
      })
      .catch((err) => {
        console.error("Gagal ambil kategori:", err);
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Fetch on mount
  useEffect(() => {
    if (base) {
      fetchCategories().then(setCategories);
    } else {
      setCategories([]); setLoading(false);
    }
  }, [base]);

  const handleDelete = async (_id) => {
    const yn = window.confirm("Yakin ingin menghapus kategori ini?");
    if (!yn) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${base}/api/categories/${_id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) {
        console.error("Server error saat delete:", res.status);
      } else {
        setCategories((prev) => prev.filter((c) => c._id !== _id));
      }
    } catch (err) {
      console.error("Error delete:", err);
    }
  };

  // Compute current page items
  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(categories.length / ITEMS_PER_PAGE)),
    [categories.length]
  );

  const shown = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return categories.slice(start, start + ITEMS_PER_PAGE);
  }, [categories, page]);

  return (
    <>
      <div className="card bg-white shadow-md rounded-md p-5 mb-3">
        <h1 className="font-bold text-lg text-gray-800 text-center">
          Daftar Kategori Produk
        </h1>
      </div>

      <div className="card shadow-md rounded-lg bg-white">
        <div className="relative overflow-x-auto p-5">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase bg-[#2f3a4a] text-white">
              <tr>
                <th className="px-4 py-3"><Checkbox {...label} /></th>
                <th className="py-3">Gambar</th>
                <th className="py-3">Kategori</th>
                <th className="py-3">Merk</th>
                <th className="py-3">Kode Motor</th>
                <th className="py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-800">
                    Memuat data kategori...
                  </td>
                </tr>
              ) : shown.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-800">
                    Tidak ada kategori ditemukan
                  </td>
                </tr>
              ) : (
                shown.map((cat, idx) => {
                  const even = idx % 2 === 0;
                  return (
                    <tr
                      key={cat._id}
                      className={`border-b ${
                        even ? "bg-[#f9fafb]" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-2">
                        <Checkbox size="small" {...label} />
                      </td>
                      <td className="py-2">
                        <div className="w-[90px] h-[90px] rounded-md overflow-hidden">
                          <Link to={`/categories/${cat._id}`}>
                            <img
                              src={cat.images?.[0] || "/no-image.png"}
                              alt={`kategori-${idx}`}
                              className="w-full h-full object-cover hover:scale-105 transition duration-150"
                            />
                          </Link>
                        </div>
                      </td>
                      <td className="py-2 font-semibold">{cat.kategori}</td>
                      <td className="py-2 text-xs">
                        {Array.isArray(cat.merk) && cat.merk.length ? (
                          <ul className="list-disc ml-4">
                            {cat.merk.map((m, i) => (
                              <li key={i}>{m}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="italic text-gray-400">‑</span>
                        )}
                      </td>
                      <td className="py-2 text-xs">
                        {cat.motors?.length ? (
                          <ul className="list-disc ml-4">
                            {cat.motors.map((m, i) => (
                              <li key={i}>{m}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="italic text-gray-400">‑</span>
                        )}
                      </td>
                      <td className="py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <Tooltip title="Edit">
                            <Link to={`/categories/edit/${cat._id}`}>
                              <Button variant="outlined"><CiEdit /></Button>
                            </Link>
                          </Tooltip>
                          <Tooltip title="Lihat">
                            <Link to={`/categories/${cat._id}`}>
                              <Button variant="outlined"><IoEyeOutline /></Button>
                            </Link>
                          </Tooltip>
                          <Tooltip title="Hapus">
                            <Button
                              variant="outlined"
                              onClick={() => handleDelete(cat._id)}
                            >
                              <IoTrashOutline />
                            </Button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center py-4">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, n) => setPage(n)}
            showFirstButton
            showLastButton
          />
        </div>
      </div>
    </>
  );
}
