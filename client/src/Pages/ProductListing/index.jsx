import React, { useState, useEffect } from 'react';
import SideBar from '../../components/SideBar';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ProductItem from '../../components/ProductItem';
import ProductItemListView from '../../components/ProductItemListView';
import { IoGridSharp } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';

const ProductListing = () => {
  const [itemView, setItemView] = useState('grid');
  const [products, setProducts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
  if (!base) console.warn('⚠️ VITE_API_BASE_URL belum diset di file .env');

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetch(`${base}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data || []);
      })
      .catch((error) => {
        console.error('Gagal fetch produk:', error);
      });
  }, []);

  return (
    <section className="py-5 pb-0">
      <div className="container">
        <Breadcrumbs aria-label="breadcrumb">
          <Link className="link transition" underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/" className="link transition">
            Modifikasi Ori
          </Link>
        </Breadcrumbs>
      </div>

      <div className="bg-white p-2 mt-4">
        <div className="container flex gap-3">
          <div className="sidebarWrapper w-[20%] h-full bg-white">
            <SideBar />
          </div>
          <div className="rightContent w-[80%] py-3">
            <div className="p-2 w-full mb-3 rounded-md flex items-center justify-between">
              <div className="col1 flex items-center gap-0">
                <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000]" onClick={() => setItemView('list')}>
                  <LuMenu className="text-[rgba(0,0,0,0.7)]" />
                </Button>
                <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000]" onClick={() => setItemView('grid')}>
                  <IoGridSharp className="text-[rgba(0,0,0,0.7)]" />
                </Button>

                <span className="text-[14px] font-[500] pl-3 text-[rgba(0,0,0,0.7)]">
                  Terdapat {products.length} Produk Yang Tersedia
                </span>
              </div>
            </div>

            <div className={`gap-4 ${itemView === 'grid' ? 'grid grid-cols-6' : 'flex flex-col'} `}>
              {products.map((product) =>
                itemView === 'grid' ? (
                  <ProductItem key={product._id} product={product} />
                ) : (
                  <ProductItemListView key={product._id} product={product} />
                )
              )}
            </div>

            <div className="flex items-center justify-center mt-10">
              <Pagination count={10} showFirstButton showLastButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;
