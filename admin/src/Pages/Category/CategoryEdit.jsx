import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UploadBox from "../../Components/UploadBox";

// Opsi varian berdasarkan kategori
const variantMap = {
  "Mangkok Ganda": ["VG‑Type1", "VG‑Type2", "VG‑Custom"],
  Roller: ["Roller‑Small", "Roller‑Large"],
  "Per CVT": ["CVT‑A", "CVT‑B"],
  "Per Centrik": ["Centrik‑X", "Centrik‑Y"]
};

const initialMerkOptions = [
  "Modifikasi Ori", "X1 Racing", "Daytona", "TDR"
];
const initialMotorOptions = ["K16", "KVY", "KVB", "B65"];

export default function CategoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const base = import.meta.env.VITE_API_BASE_URL;

  // Form state
  const [kategori, setKategori] = useState("");
  const [merkOptions, setMerkOptions] = useState(initialMerkOptions);
  const [selectedMerk, setSelectedMerk] = useState([]);
  const [motorOptions, setMotorOptions] = useState(initialMotorOptions);
  const [selectedMotors, setSelectedMotors] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [images, setImages] = useState([]);            // array of URL strings
  const [removedImages, setRemovedImages] = useState([]); // URL yang dihapus
  const [loading, setLoading] = useState(true);

  // Muat data kategori dari backend
  useEffect(() => {
    if (!base) {
      console.error("VITE_API_BASE_URL belum diset");
      return setLoading(false);
    }
    const token = localStorage.getItem("token");
    fetch(`${base}/api/categories/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    })
      .then(res => {
        if (!res.ok) throw new Error("Kategori tidak ditemukan");
        return res.json();
      })
      .then(json => {
        const data = json.data ?? json;
        setKategori(data.kategori ?? "");
        setSelectedMerk(data.merk ?? []);
        setSelectedMotors(data.motors ?? []);
        setSelectedVariants(data.variants ?? []);
        setImages(data.images ?? []);
        // Tambahkan merk/motor baru ke dropdown jika belum ada
        setMerkOptions(prev => Array.from(new Set([...prev, ...(data.merk ?? [])])));
        setMotorOptions(prev => Array.from(new Set([...prev, ...(data.motors ?? [])])));
      })
      .catch(err => {
        alert(err.message);
      })
      .finally(() => setLoading(false));
  }, [base, id]);

  const toggle = (val, arr, setter) => {
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const handleAddMerk = () => {
    const v = prompt("Masukkan merk baru:")?.trim() ?? "";
    if (v && !merkOptions.includes(v)) {
      setMerkOptions(prev => [...prev, v]);
      setSelectedMerk(prev => [...prev, v]);
    }
  };

  const handleAddMotor = () => {
    const v = prompt("Masukkan kode motor baru:")?.trim() ?? "";
    if (v && !motorOptions.includes(v)) {
      setMotorOptions(prev => [...prev, v]);
      setSelectedMotors(prev => [...prev, v]);
    }
  };

  const handleRemoveImage = idx => {
    const img = images[idx];
    setRemovedImages(prev => [...prev, img]);
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (images.length === 0) return alert("Minimal ada 1 gambar.");

    const token = localStorage.getItem("token");
    const payload = {
      kategori,
      merk: selectedMerk,
      motors: selectedMotors,
      variants: kategori in variantMap ? selectedVariants : [],
      images,
      removedImages
    };

    try {
      setLoading(true);
      const res = await fetch(`${base}/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(payload)
      });

      const j = await res.json();
      if (!res.ok) throw new Error(j.message || res.status);
      alert("Kategori berhasil diperbarui");
      navigate("/categorylist");
    } catch (err) {
      alert(err.message ?? "Error saat menyimpan");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Memuat data…</p>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-6">Edit Kategori</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nama kategori */}
        <div>
          <label className="block font-medium mb-1">Nama Kategori</label>
          <input
            type="text"
            className="mt-1 w-full border rounded p-2"
            value={kategori}
            onChange={e => setKategori(e.target.value)}
            required
          />
        </div>

        {/* Merk Produk */}
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedMerk.map(m => (
              <span key={m} className="bg-gray-200 px-2 py-1 rounded">{m}</span>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddMerk}
            className="mb-2 bg-green-500 text-white px-3 py-1 rounded"
          >Tambah Merk</button>
          <div className="flex flex-wrap gap-4">
            {merkOptions.map(m => (
              <label key={m} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedMerk.includes(m)}
                  onChange={() => toggle(m, selectedMerk, setSelectedMerk)}
                  className="mr-1"
                />
                {m}
              </label>
            ))}
          </div>
        </div>

        {/* Kode Motor */}
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedMotors.map(m => (
              <span key={m} className="bg-gray-200 px-2 py-1 rounded">{m}</span>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddMotor}
            className="mb-2 bg-green-500 text-white px-3 py-1 rounded"
          >Tambah Motor</button>
          <div className="flex flex-wrap gap-4">
            {motorOptions.map(m => (
              <label key={m} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedMotors.includes(m)}
                  onChange={() => toggle(m, selectedMotors, setSelectedMotors)}
                  className="mr-1"
                />
                {m}
              </label>
            ))}
          </div>
        </div>

        {/* Variants */}
        {kategori in variantMap && (
          <div>
            <label className="block font-medium mb-2">Variants</label>
            <div className="flex flex-wrap gap-3">
              {variantMap[kategori].map(v => (
                <label key={v} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedVariants.includes(v)}
                    onChange={() => toggle(v, selectedVariants, setSelectedVariants)}
                    className="mr-1"
                  />
                  {v}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Upload / Remove Gambar */}
        <div>
          <label className="block font-medium mb-2">Gambar</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((imgUrl, idx) => (
              <div key={idx} className="relative w-24 h-24">
                <img
                  src={imgUrl}
                  alt={`preview-${idx}`}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-0 right-0 text-red-600 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <UploadBox onUpload={url => {
            setImages(prev => [...prev, url]);
          }} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`bg-blue-600 text-white px-5 py-2 rounded font-semibold ${loading ? "opacity-50 pointer-events-none" : ""}`}
          disabled={loading}
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
