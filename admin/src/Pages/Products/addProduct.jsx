// src/components/AddProduct.jsx

import React, { useState, useEffect } from "react";
import {
  MenuItem,
  Select,
  Checkbox,
  OutlinedInput,
  ListItemText,
  Button,
  TextField,
} from "@mui/material";
import UploadBox from "../../Components/UploadBox";
import { RiUploadCloud2Line } from "react-icons/ri";
import { toast } from "react-toastify";

// konstanta MUI
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

export default function AddProduct() {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base) {
    console.error("⚠️ VITE_API_BASE_URL belum ada di .env (root folder)");
  }

  const [categories, setCategories] = useState([]);
  const [productSubCat, setProductSubCat] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [motorBrands, setMotorBrands] = useState([]);
  const [variantKartel, setVariantKartel] = useState([]);
  const [prices, setPrices] = useState({});
  const [images, setImages] = useState([]);

  // --- Load kategori sekali saat komponen mount
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${base}/api/categories`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const arr = Array.isArray(json) ? json : json.data || [];
        setCategories(arr);
      } catch (err) {
        console.error("Tidak bisa mengambil kategori:", err);
        toast.error("Gagal load kategori");
      }
    })();
  }, [base]);

  // --- Ambil merk dan motors dari subkategori yang dipilih
  const selCat = categories.find(c => c.kategori === productSubCat) || {};
  const brandOptions = selCat.merk || [];
  const motorOptions = selCat.motors || [];
  const variantOptions = selCat.variants || [];

  const handleSubCatChange = e => {
    setProductSubCat(e.target.value);
    setMotorBrands([]);
    setVariantKartel([]);
    setProductBrand("");
    setPrices({});
  };

  const handleMotorChange = e => {
    const chosen = typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value;
    setMotorBrands(chosen);

    setPrices(prev => {
      const next = { ...prev };
      const variantKeys = variantKartel.length > 0 ? variantKartel : ["Default"];
      chosen.forEach(m => {
        next[m] = next[m] || {};
        variantKeys.forEach(v => {
          next[m][v] = next[m][v] ?? { hpp: 0, umum: 0, reseller: 0 };
        });
      });
      return next;
    });
  };

  const handleVariantChange = e => {
    const chosen = typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value;
    setVariantKartel(chosen);

    setPrices(prev => {
      const next = { ...prev };
      motorBrands.forEach(m => {
        next[m] = next[m] || {};
        chosen.forEach(v => {
          next[m][v] = next[m][v] ?? { hpp: 0, umum: 0, reseller: 0 };
        });
      });
      return next;
    });
  };

  const handlePriceChange = (motor, variant, field, val) => {
    setPrices(prev => ({
      ...prev,
      [motor]: {
        ...prev[motor],
        [variant]: {
          ...prev[motor][variant],
          [field]: Number(val),
        }
      }
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const realMotors = motorBrands.filter(Boolean);
    const sizes = {};
    realMotors.forEach(m => {
      const keys = variantKartel.length > 0 ? variantKartel : ["Default"];
      if (!prices[m]) return;
      sizes[m] = {};
      keys.forEach(k => {
        if (prices[m][k]) {
          sizes[m][k] = prices[m][k];
        }
      });
    });

    const payload = {
      name: e.target.name.value,
      description: e.target.description?.value || "",
      category: productSubCat,
      brand: productBrand,
      motorBrands: realMotors,
      variantKartel,
      sizes,
      images
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined
        },
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.message ?? `HTTP ${res.status}`);
      }
      toast.success("Produk berhasil ditambahkan");
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      console.error("Submit gagal:", err);
      toast.error("Gagal: " + (err.message || "Silakan coba lagi"));
    }
  };

  const menuVariants = variantKartel.length > 0 ? variantKartel : ["Default"];

  return (
    <section className="p-5 bg-[#f1f1f1] min-h-screen">
      <form onSubmit={handleSubmit} className="form py-4 p-6 bg-white rounded shadow">
        <TextField
          name="name"
          label="Nama Produk"
          variant="outlined"
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          name="description"
          label="Deskripsi Produk"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 3 }}
        />

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <h3>Kategori (Sub)</h3>
            <Select
              value={productSubCat}
              onChange={handleSubCatChange}
              size="small"
              fullWidth
              required
            >
              <MenuItem value="">Pilih Sub-kategori</MenuItem>
              {categories.map(c => (
                <MenuItem key={c._id} value={c.kategori}>
                  {c.kategori}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <h3>Merk Produk</h3>
            <Select
              value={productBrand}
              onChange={e => setProductBrand(e.target.value)}
              size="small"
              fullWidth
            >
              <MenuItem value="">None</MenuItem>
              {brandOptions.map(b => (
                <MenuItem key={b} value={b}>{b}</MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <h3>Kode Motor</h3>
            <Select
              multiple
              size="small"
              value={motorBrands}
              onChange={handleMotorChange}
              input={<OutlinedInput />}
              renderValue={vals => vals.join(", ")}
              MenuProps={MenuProps}
              fullWidth
            >
              {motorOptions.map(m => (
                <MenuItem key={m} value={m}>
                  <Checkbox checked={motorBrands.includes(m)} />
                  <ListItemText primary={m} />
                </MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <h3>Varian</h3>
            <Select
              multiple
              size="small"
              value={variantKartel}
              onChange={handleVariantChange}
              input={<OutlinedInput />}
              renderValue={vals => vals.join(", ")}
              MenuProps={MenuProps}
              fullWidth
            >
              {variantOptions.map(v => (
                <MenuItem key={v} value={v}>
                  <Checkbox checked={variantKartel.includes(v)} />
                  <ListItemText primary={v} />
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>

        {motorBrands.length > 0 && (
          <div className="p-4 mb-4 bg-white border rounded">
            {motorBrands.map(motor => (
              <div key={motor} className="mb-3 border-b pb-3">
                <h4 className="font-medium">{motor}</h4>
                {menuVariants.map(key => (
                  <div key={key} className="flex items-center gap-4 mt-1">
                    <h5 className="w-28">{key}:</h5>
                    {["hpp", "reseller", "umum"].map(f => (
                      <TextField
                        key={f}
                        label={f.toUpperCase()}
                        type="number"
                        size="small"
                        value={prices[motor]?.[key]?.[f] ?? ""}
                        onChange={e =>
                          handlePriceChange(motor, key, f, e.target.value)
                        }
                        required
                        InputProps={{ inputProps: { min: 0 } }}
                        sx={{ width: 100 }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="mb-4">
          <h3>Upload Gambar</h3>
          <UploadBox onUpload={url => setImages(prev => [...prev, url])} />
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<RiUploadCloud2Line />}
        >
          Simpan & Publish Produk
        </Button>
      </form>
    </section>
  );
}
