// src/components/CartItems.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { Button } from '@mui/material';

const CartItems = ({ item, onRemove, onUpdate }) => {
  return (
    <SingleCartItem
      item={item}
      onRemove={() => onRemove(item)}
      onUpdate={(updated) => onUpdate(item, updated)}
    />
  );
};

const SingleCartItem = ({ item, onRemove, onUpdate }) => {
  const p = item.productId; // data produk lengkap
  const [selectedLabel, setSelectedLabel] = useState(item.variantLabel || '');
  const [merkLabel, setMerkLabel] = useState(item.merkLabel || '');
  const [note, setNote] = useState(item.note || '');
  const qty = item.qty || 0;

  // Sync perubahan catatan
  const handleSave = () => {
    onUpdate({
      variantLabel: selectedLabel,
      merkLabel,
      qty: item.qty,
      note
    });
  };

  // Ambil harga reseller dari struktur nested
  const hargaReseller = merkLabel
    ? (p.sizes?.[merkLabel]?.[selectedLabel]?.reseller
       ?? p.sizes?.[merkLabel]?.reseller
       ?? 0)
    : 0;

  return (
    <div className="cartItem w-full p-3 flex items-center gap-4 border-b">
      <div className="img w-[10%] rounded-md overflow-hidden">
        <Link to={`/product/${p._id}`} className="group">
          <img
            src={p.images?.[0]}
            alt={p.name}
            className="w-full transition-all"
          />
        </Link>
      </div>

      <div className="info w-[90%] relative">
        <IoMdCloseCircleOutline
          onClick={onRemove}
          className="cursor-pointer absolute top-0 right-0 text-2xl"
        />
        <span className="text-sm font-bold">{p.brand}</span>
        <h3 className="text-lg">
          <Link to={`/product/${p._id}`}>{p.name}</Link>
        </h3>

        <div className="mt-2 flex items-center gap-6">
          <div className="flex items-center gap-1">
            <span className="font-medium">Motor :</span>
            <span>{merkLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Variant :</span>
            <span>{selectedLabel || '-'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="ml-4">Qty: {qty} Pcs</span>
          </div>
        </div>

        <div className="mt-2">
          <label className="block text-sm">Catatan:</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={handleSave}
            className="w-full border rounded p-1"
            placeholder="Misal: Motor Honda 2020"
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[rgba(0,0,0,0.5)] text-sm">Harga Satuan</span>
            <span className="text-[rgba(0,0,0,0.5)] text-sm">
              Rp {hargaReseller.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Harga Total :</span>
            <span className="font-bold text-primary">
              Rp {(hargaReseller * qty).toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
