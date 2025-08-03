// src/components/CartPanel/index.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { MdDeleteForever } from "react-icons/md";
import { Button } from '@mui/material';

const CartPanel = () => {
  const { cart, refreshCart } = useCart();

  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
  if (!base) console.warn('⚠️ VITE_API_BASE_URL belum didefinisikan di file .env');

  const handleRemove = async (item) => {
    try {
      await fetch(`${base}/api/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: item.productId._id,
          variantIndex: item.variantIndex,
          variantLabel: item.variantLabel,
          quantity: 0,
          note: item.note
        })
      });
      await refreshCart();
    } catch (err) {
      console.error('Gagal menghapus item:', err);
    }
  };

  const subtotal = cart.products.reduce((sum, item) => {
    const price = item.productId.sizes?.[item.merkLabel]?.[item.variantLabel]?.reseller ?? 0;
    const qty = item.qty || item.quantity || 0;
    return sum + price * qty;
  }, 0);

  return (
    <div className="panel-container">
      <div className="scroll">
        {cart.products.map((item) => {
          const price = item.productId.sizes?.[item.merkLabel]?.[item.variantLabel]?.reseller ?? 0;
          const qty = item.qty || item.quantity || 0;
          const itemTotal = price * qty;

          return (
            <div key={`${item.productId._id}-${item.variantIndex}-${item.variantLabel}`} className="cartItem flex items-start gap-4 border-b py-3">
              <div className="img w-[25%] h-full overflow-hidden">
                <Link to={`/product/${item.productId._id}`}>
                  <img src={item.productId.images?.[0] || '/placeholder.jpg'} className="w-[90%] h-[75%] object-cover" alt={item.productId.name} />
                </Link>
              </div>
              <div className="info w-[75%] relative">
                <h4 className="text-[16px] font-medium mb-1">
                  <Link to={`/product/${item.productId._id}`} className="link">
                    {item.productId.name}
                  </Link>
                </h4>
                <p className="text-[14px] mb-1">
                  <span className="font-medium">Merk Motor:</span> {item.merkLabel || item.variantIndex}
                </p>
                <p className="text-[14px] mb-1">
                  <span className="font-medium">Variant:</span> {item.variantLabel}
                </p>
                <p className="flex items-center gap-6 mb-1">
                  <span>Jumlah: <strong>{qty}</strong></span>
                  <span className="text-primary font-bold">
                    Harga: Rp {itemTotal.toLocaleString()}
                  </span>
                </p>
                <p className="mb-1">
                  <span className="font-medium">Note:</span> {item.note || '-'}
                </p>
                <MdDeleteForever
                  className="absolute top-2 right-2 cursor-pointer text-[20px] text-red-500"
                  onClick={() => handleRemove(item)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bottomSection">
        <div className="bottomInfo pb-4 py-8 px-6 flex flex-col gap-3 bg-white border border-t-2 border-[rgba(0,0,0,0.1)] shadow-md">
          <div className="flex justify-between">
            <span className="font-medium">Total Harga</span>
            <span className="text-primary font-bold">Rp {subtotal.toLocaleString()}</span>
          </div>
          <Link to="/cart" className="w-full block">
            <Button className="w-full !bg-[#ff0000] !text-white hover:!bg-green-500">
              Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
