import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { IoMdCloudUpload } from "react-icons/io";
import { IoCart } from "react-icons/io5";
import CartItems from './cartitems';
import { AuthContext } from '../../components/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../components/CartContext'; 

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const [cart, setCart ] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [uploadedResiFile, setUploadedResiFile] = useState(null);

  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
  if (!base) console.warn('⚠️ VITE_API_BASE_URL belum didefinisikan di file .env');

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('token');
    console.log('🔥 CartPage - user OK, panggil fetch cart...', user, token);

    fetch(`${base}/api/cart`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        console.log('Fetch cart respon status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('🔥 Cart data dari server :', data);
        setCart(data);
      })
      .catch(err => {
        console.error('Fetch cart error', err);
        setCart({ products: [] });
      });
  }, [user]);

  if (!user) return <Navigate to="/login" />;
  if (cart === null) return <div>Loading cart…</div>;
  if (!cart.products || cart.products.length === 0) return <div>Keranjang masih kosong.</div>;

  const total = cart.products.reduce((sum, item) => {
    const p = item.productId;
    const merk = item.merkLabel;
    const variant = item.variantLabel;

    const price = merk
      ? ( p.sizes?.[merk]?.[variant]?.reseller
          ?? p.sizes?.[merk]?.reseller
          ?? 0 )
      : 0;

    const qty = item.quantity || item.qty || 1;
    return sum + price * qty;
  }, 0);

  const handleCheckout = async () => {
    if (!uploadedResiFile) return alert('Harap upload resi sebelum checkout');
    const token = localStorage.getItem('token');
    const payload = {
      items: cart.products.map(item => ({
        product: item.productId._id,
        variantIndex: Number(item.variantIndex),
        variantLabel: item.variantLabel,
        merkLabel: item.merkLabel,
        qty: item.quantity || item.qty,
        price: item.productId.sizes[item.merkLabel][item.variantLabel].reseller,
        note: item.note,
      })),
      totalPrice: total,
      resiFile: uploadedResiFile,
    };
    console.log('🚀 Payload checkout:', payload);

    const res = await fetch(`${base}/api/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      clearCart();
      alert('✅ Checkout berhasil! Order ID: ' + data.order._id);
      setCart({ products: [] });
      navigate('/my-orders');
    } else {
      alert('❌ Checkout gagal: ' + data.message);
    }
  };

  const handleFileChange = e => {
    const selected = e.target.files?.[0];
    if (selected?.type === 'application/pdf') setFile(selected);
    else alert('Harap pilih file PDF!');
  };

  const handleUpload = async () => {
    if (!file) return alert('Pilih file PDF dulu');
    const formData = new FormData();
    formData.append('resi', file);

    try {
      const response = await fetch(`${base}/api/upload/upload-resi`, {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || response.statusText);
      alert('✅ Resi berhasil diupload!');
      setUploadedResiFile(data.filename);
    } catch (err) {
      console.error('Upload error:', err);
      alert(`❌ Upload gagal: ${err.message}`);
    }
  };

  const handleRemove = async (item) => {
    const token = localStorage.getItem('token');
    const resPut = await fetch(`${base}/api/cart`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: item.productId._id,
        variantIndex: item.variantIndex,
        quantity: 0,
        note: item.note,
      }),
    });

    if (!resPut.ok) {
      const err = await resPut.json();
      return alert('Gagal hapus: ' + err.message);
    }

    const updatedCart = await resPut.json();
    setCart(updatedCart);
  };

  return (
    <section className="section py-10 pb-10">
      <div className="container w-[80%] max-w-[80%] flex gap-5">
        {/* Kiri: Daftar item */}
        <div className="leftPart w-[70%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)]">
              <h2 className="text-[22px] font-[900]">Keranjang Barang Anda</h2>
              <p className="mt-0">
                Dikeranjang terdapat <span className="font-bold text-primary">{cart.products.length}</span> produk
              </p>
            </div>
            {cart.products.map(item => (
              <CartItems
                key={item._id}
                item={item}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>

        {/* Kanan: Summary + Upload Resi */}
        <div className="rightPart w-[30%]">
          <div className="shadow-md rounded-md bg-white p-5">
            <h3 className="pb-3">Total Pembayaran</h3>
            <hr />

            <p className="flex items-center justify-between">
              <span className="text-[14px] font-[500]">Belanja</span>
              <span className="text-primary font-bold">Rp. {total.toLocaleString()}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[14px] font-[500]">Ongkos Kirim</span>
              <span className="text-primary font-bold">Gratis</span>
            </p>
            <p className="flex items-center justify-between border-b border-[rgba(0,0,0,0.2)]">
              <span className="text-[14px] font-[500]">Estimasi Pengiriman</span>
              <span className="text-primary font-bold">2 - 3 Hari</span>
            </p>
            <p className="flex items-center justify-between mt-3">
              <span className="text-[18px] font-[700]">Total</span>
              <span className="text-primary font-bold text-[22px]">Rp. {total.toLocaleString()}</span>
            </p>

            <br />
            <Button
              onClick={handleCheckout}
              className="flex gap-2 w-full !bg-[#ff0000] !text-white hover:!bg-black transition"
            >
              <IoCart className="text-[20px]" />Checkout
            </Button>
          </div>

          <div className="mt-6 rounded-md bg-white p-5">
            <Button onClick={handleUpload}>Upload Resi</Button>
            <hr />
            <div className="mt-4 flex flex-col gap-4">
              <Button component="label" variant="contained" startIcon={<IoMdCloudUpload />} className="!bg-[#ff0000] !text-white w-full">
                Pilih PDF
                <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
              </Button>

              {file && <p className="text-gray-700 text-sm">Terpilih: <strong>{file.name}</strong></p>}

              <Button onClick={handleUpload} disabled={!file} className="!bg-[#ff0000] !text-white w-full">
                Upload Resi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
