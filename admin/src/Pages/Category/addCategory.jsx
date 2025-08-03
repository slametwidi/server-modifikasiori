// src/pages/AddCategory.jsx
import React, { useState } from "react";
import {
  TextField, Checkbox, FormControlLabel, Button,
  Box, IconButton
} from "@mui/material";
import { RiUploadCloud2Line, RiCloseCircleLine } from "react-icons/ri";
import UploadBox from "../../Components/UploadBox";

const initialBrandOptions = [
  "Modifikasi Ori","X1 Racing","Daytona","BRT","TDR","Dr. Pulley",
  "Proper","UMA RACING","RCB","ARM"
];
const initialMotorOptions = ["K16","KVY","KVB","B65","NMAX","AEROX"];
const variantMap = {
  "Mangkok Ganda": ["VG‑Type1","VG‑Type2","VG‑Custom"],
  Roller: ["Roller‑Small","Roller‑Large"],
  "Per CVT": ["CVT‑A","CVT‑B"],
  "Per Centrik": ["Centrik‑X","Centrik‑Y"]
};

export default function AddCategory() {
  const [kategori, setKategori] = useState("");
  const [brandOptions, setBrandOptions] = useState(initialBrandOptions);
  const [motorOptions, setMotorOptions] = useState(initialMotorOptions);
  const [inputBrand, setInputBrand] = useState("");
  const [inputMotor, setInputMotor] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedMotors, setSelectedMotors] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [images, setImages] = useState([]); // array of string URLs
  const [loading, setLoading] = useState(false);

  const toggle = (val, arr, setter) =>
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const handleAddBrand = () => {
    const v = inputBrand.trim();
    if (v && !brandOptions.includes(v)) {
      setBrandOptions(prev => [...prev, v]);
      setInputBrand("");
    }
  };
  const handleAddMotor = () => {
    const v = inputMotor.trim();
    if (v && !motorOptions.includes(v)) {
      setMotorOptions(prev => [...prev, v]);
      setInputMotor("");
    }
  };
  const handleDeleteBrand = b => {
    setBrandOptions(prev => prev.filter(x => x !== b));
    setSelectedBrands(prev => prev.filter(x => x !== b));
  };
  const handleDeleteMotor = m => {
    setMotorOptions(prev => prev.filter(x => x !== m));
    setSelectedMotors(prev => prev.filter(x => x !== m));
  };
  const handleImageReplace = () => setImages([]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!images.length) return alert("Minimal upload 1 gambar.");

    const base = import.meta.env.VITE_API_BASE_URL;
    if (!base) {
      console.error("API base tidak ditetapkan");
      return alert("Fatal: API base belum diset.");
    }

    const token = localStorage.getItem("token");
    const payload = {
      kategori,
      merk: selectedBrands,
      motors: selectedMotors,
      variants: kategori in variantMap ? selectedVariants : [],
      images
    };

    try {
      setLoading(true);
      const res = await fetch(`${base}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || res.status);

      alert("Berhasil disimpan!");
      setKategori("");
      setSelectedBrands([]);
      setSelectedMotors([]);
      setSelectedVariants([]);
      setImages([]);
    } catch (err) {
      alert(err instanceof Error ? err.message : err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-5">
      <form onSubmit={handleSubmit} className="py-3 p-8">
        <TextField
          label="Kategori Produk"
          variant="outlined"
          value={kategori}
          onChange={e => {
            setKategori(e.target.value);
            setSelectedVariants([]);
          }}
          fullWidth
          required
          sx={{ mb: 3 }}
        />

        {/* Brand Input */}
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <TextField
            label="Tambah Merk Produk"
            size="small"
            value={inputBrand}
            onChange={e => setInputBrand(e.target.value)}
          />
          <Button variant="outlined" onClick={handleAddBrand}>
            Tambah
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {brandOptions.map(b => (
            <Box
              key={b}
              sx={{
                width: 150,
                position: "relative",
                borderRadius: 1,
                "&:hover .del": { visibility: "visible" }
              }}
            >
              <IconButton
                size="small"
                className="del"
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  visibility: "hidden",
                  color: "gray",
                  "&:hover": { color: "red" }
                }}
                onClick={() => handleDeleteBrand(b)}
              >
                <RiCloseCircleLine />
              </IconButton>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedBrands.includes(b)}
                    onChange={() => toggle(b, selectedBrands, setSelectedBrands)}
                  />
                }
                label={b}
              />
            </Box>
          ))}
        </Box>

        {/* Motor Input */}
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <TextField
            label="Tambah Kode Motor"
            size="small"
            value={inputMotor}
            onChange={e => setInputMotor(e.target.value)}
          />
          <Button variant="outlined" onClick={handleAddMotor}>
            Tambah
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {motorOptions.map(m => (
            <Box
              key={m}
              sx={{
                width: 150,
                position: "relative",
                borderRadius: 1,
                "&:hover .del": { visibility: "visible" }
              }}
            >
              <IconButton
                size="small"
                className="del"
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  visibility: "hidden",
                  color: "gray",
                  "&:hover": { color: "red" }
                }}
                onClick={() => handleDeleteMotor(m)}
              >
                <RiCloseCircleLine />
              </IconButton>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedMotors.includes(m)}
                    onChange={() => toggle(m, selectedMotors, setSelectedMotors)}
                  />
                }
                label={m}
              />
            </Box>
          ))}
        </Box>

        {/* Variant */}
        {kategori in variantMap && (
          <Box sx={{ mb: 3 }}>
            <h3 className="mb-2 font-medium">Size / Variant</h3>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {variantMap[kategori].map(v => (
                <Box key={v} sx={{ width: 150 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedVariants.includes(v)}
                        onChange={() => toggle(v, selectedVariants, setSelectedVariants)}
                      />
                    }
                    label={v}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Upload Images */}
        <Box sx={{ mb: 4 }}>
          <h3 className="font-bold text-[18px] mb-2">Upload Gambar</h3>
          <Box className="grid grid-cols-6 gap-2 items-center">
            {images.length === 0 ? (
              <UploadBox onUpload={url => setImages([url])} />
            ) : (
              images.map((url, i) => (
                <Box key={i} sx={{ width: 140 }}>
                  <img
                    src={url}
                    alt={`img-${i}`}
                    style={{ width: "100%", borderRadius: 6, cursor: "pointer" }}
                    onClick={() => window.open(url, "_blank")}
                  />
                  <Button
                    variant="text"
                    color="secondary"
                    size="small"
                    onClick={handleImageReplace}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    Ganti Gambar
                  </Button>
                </Box>
              ))
            )}
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<RiUploadCloud2Line />}
          type="submit"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan & Publish Produk"}
        </Button>
      </form>
    </section>
  );
}
