import React, { useRef } from 'react';
import { FaRegImage } from "react-icons/fa";

const UploadBox = ({ onUpload }) => {
  const inputRef = useRef(null);

  // REACT_APP_API_BASE_URL wajib diawali REACT_APP_ agar CRA memprosesnya saat build
  // (Create‑React‑App tidak mengizinkan variabel custom tanpa prefix REACT_APP_) :contentReference[oaicite:1]{index=1}
const base = import.meta.env.VITE_API_BASE_URL;

  async function handleChange(e) {
    const file = e.currentTarget.files[0];
    if (!file) return;

    if (!base) {
      console.error("Miliki `REACT_APP_API_BASE_URL` belum diset di .env");
      alert("Fatal error: API base URL belum ditetapkan.");
      return;
    }

    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`${base}/api/upload/upload-image`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: form,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message || res.statusText);
      }

      const result = await res.json();
      onUpload(result.url);
    } catch (err) {
      console.error("Upload error:", err);
      alert(`Upload gagal: ${err.message}`);
    }
  }

  return (
    <div
      onClick={() => inputRef.current && inputRef.current.click()}
      className="uploadBox cursor-pointer text-center p-6 border rounded hover:bg-gray-100"
    >
      <FaRegImage className="text-[50px] opacity-30 mx-auto mb-2" />
      <h4 className="text-gray-600">Click or tap to upload image</h4>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

export default UploadBox;
