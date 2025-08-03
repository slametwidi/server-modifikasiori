import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { Button } from '@mui/material';
import { useNotification } from '../../components/NotificationContext';
import { useCart } from '../../components/CartContext';
import { QtyBox } from '../../components/QtyBox';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productActionIndex, setProductActionIndex] = useState(null);
  const [variantActionIndex, setVariantActionIndex] = useState(null);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');
  const showNotif = useNotification();
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
  if (!base) console.warn('⚠️ VITE_API_BASE_URL belum diset di file .env');

  useEffect(() => {
    fetch(`${base}/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  const sizes = product.sizes || {};
  const motorCodes = Object.keys(sizes);

  const variantList = Array.from(
    new Set(motorCodes.flatMap(code => Object.keys(sizes[code] || {})))
  );

  const selectedCode = productActionIndex != null ? motorCodes[productActionIndex] : null;
  const selectedVariant = variantActionIndex != null ? variantList[variantActionIndex] : null;

  const hargaReseller = selectedCode && selectedVariant
    ? (sizes[selectedCode]?.[selectedVariant]?.reseller ?? 0)
    : 0;

  const handleAddToCart = async () => {
    if (productActionIndex == null || variantActionIndex == null) {
      return alert("Pilih kode motor dan variant terlebih dahulu!");
    }
    const payload = {
      productId: product._id,
      merkLabel: selectedCode,
      variantLabel: selectedVariant,
      variantIndex: variantActionIndex,
      hargaReseller,
      qty,
      note: note.trim(),
    };
    try {
      const res = await fetch(`${base}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        showNotif('Produk berhasil dimasukkan ke keranjang!', 'success');
        refreshCart();
        navigate('/ProductListing');
      } else {
        alert(`Gagal: ${data.message || res.statusText}`);
      }
    } catch (err) {
      console.error('Cart error:', err);
      alert('Gagal menambahkan ke keranjang');
    }
  };

  return (
    <>
      <div className="py-5">
        <div className="container">
          <Breadcrumbs aria-label="breadcrumb">
            <Link className="link transition" to="/">Home</Link>
            <Link className="link transition" to={`/category/${product.category}`}>{product.category}</Link>
            <span>{product.name}</span>
          </Breadcrumbs>
        </div>
      </div>

      <section className="bg-white py-5">
        <div className="container flex gap-8">
          <div className="productZoomContainer w-[40%]">
            <img src={product.images?.[0]} alt={product.name} className="w-[400px] h-[400px] object-cover" />
          </div>

          <div className="productContent w-[60%]">
            <h1 className="text-[25px] font-[600] mb-1">{product.name}</h1>
            <p className="text-gray-400 text-[15px]">
              Vendor Part: <span className="font-[500] text-black">{product.brand || 'Tidak Ada'}</span>
            </p>
            <p className="text-xl text-primary font-bold mt-2">
              Rp {hargaReseller.toLocaleString('id-ID')}
            </p>

            <div className="flex gap-3 mt-5">
              <span className="text-[16px] w-[100px]">Kode Motor :</span>
              <div className="flex flex-wrap items-center gap-2">
                {motorCodes.map((code, idx) => (
                  <Button
                    key={code}
                    variant={productActionIndex === idx ? 'contained' : 'outlined'}
                    onClick={() => {
                      setProductActionIndex(idx);
                      setVariantActionIndex(null);
                    }}
                  >
                    {code}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <span className="text-[16px] w-[100px]">Variant :</span>
              <div className="flex items-center gap-2">
                {variantList.map((v, idx) => (
                  <Button
                    key={v}
                    variant={variantActionIndex === idx ? 'contained' : 'outlined'}
                    onClick={() => setVariantActionIndex(idx)}
                  >
                    {v}
                  </Button>
                ))}
              </div>
            </div>

            <p className="text-[14px] mt-8 mb-5 text-[rgba(0,0,0,0.5)]">
              Masukan Catatan Tambahan Jika Perlu
            </p>

            <div className="flex items-center gap-4">
              <div className="qtyBoxWrapper w-[60px]">
                <QtyBox value={qty} onChange={v => setQty(v)} />
              </div>
              <Button onClick={handleAddToCart} className="flex gap-2 !bg-[#ff0000] !text-white hover:!bg-black">
                <MdOutlineShoppingCart className="text-[22px]" /> Masukan ke Keranjang
              </Button>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <span className="flex items-center gap-2 text-[15px] font-[500] link cursor-pointer">
                <FaRegHeart className="text-[18px]" /> Masukan ke Wishlist
              </span>
            </div>

            <div className="mt-4">
              <label htmlFor="product-note" className="block text-[14px] font-medium mb-1">
                Tambahkan Catatan:
              </label>
              <textarea
                id="product-note"
                rows={3}
                className="w-[50%] border border-gray-300 rounded p-2"
                placeholder="Contoh: Untuk Honda Tahun 2018."
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
