import React, { useEffect, useState } from 'react';
import HomeSlider from '../../components/HomeSlider';
import HomeCatSlider from '../../components/HomeCatSlider';
import { FaMotorcycle } from "react-icons/fa";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ProductsSlider from '../../components/ProductsSlider';

const Home = () => {
  const [value, setValue] = React.useState(0);
  const [products, setProducts] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
  if (!base) console.warn('⚠️ VITE_API_BASE_URL belum didefinisikan di file .env');

  useEffect(() => {
    fetch(`${base}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  return (
    <>
      <HomeSlider />
      <HomeCatSlider />

      <section className="bg-white py-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="leftSec">
              <h2 className="text-[20px] font-[600]">Produk dan Aksesoris</h2>
            </div>

            <div className="rightSec w-[60%]">
              <Box sx={{ bgcolor: 'background.paper' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  <Tab label="Produk Terbaru" />
                  <Tab label="Mangkok Custom" />
                  <Tab label="Pulley Set Custom" />
                  <Tab label="Piece Slide" />
                  <Tab label="V-Belt" />
                  <Tab label="Ramplate" />
                  <Tab label="Per Sentrik" />
                </Tabs>
              </Box>
            </div>
          </div>

          <ProductsSlider products={products} items={8} />
        </div>
      </section>
    </>
  );
};

export default Home;
