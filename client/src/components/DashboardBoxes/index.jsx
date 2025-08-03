import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { FaGift } from "react-icons/fa6";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaProductHunt } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";

const DashboardBoxes = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
  if (!base) console.warn('⚠️ VITE_API_BASE_URL belum didefinisikan di file .env');

  useEffect(() => {
    fetch(`${base}/api/orders/my/summary`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.clone().text().then(txt => {
            console.error('Response bukan JSON:', txt);
            throw new Error(`HTTP error ${res.status}`);
          });
        }
        return res.json();
      })
      .then(data => {
        setTotalOrders(data.totalOrders);
        setTotalPending(data.totalPending);
        setTotalRevenue(data.totalRevenue);
        setTotalProducts(data.totalProducts);
      })
      .catch(err => console.error('Fetch summary error:', err));
  }, []);

  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="dashboardBoxesSlider"
      >
        <SwiperSlide>
          <div className='box bg-white p-5 cursor-pointer hover:bg-[#f1f1f1] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4'>
            <FaGift className='text-[30px] text-[#3872fa]' />
            <div className='info w-[70%]'>
              <h3>Total Pesanan</h3>
              <b>{totalOrders?.toLocaleString()}</b>
            </div>
            <IoStatsChartSharp className='text-[50px] text-[#3872fa]' />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='box bg-white p-5 cursor-pointer hover:bg-[#f1f1f1] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4'>
            <FaProductHunt className='text-[30px] text-[#10b981]' />
            <div className='info w-[70%]'>
              <h3>Total Produk</h3>
              <b>{totalProducts?.toLocaleString()}</b>
            </div>
            <IoStatsChartSharp className='text-[50px] text-[#10b981]' />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='box bg-white p-5 cursor-pointer hover:bg-[#f1f1f1] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4'>
            <FaChartLine className='text-[30px] text-[#7928ca]' />
            <div className='info w-[70%]'>
              <h3>Total Omset</h3>
              <b><span>Rp. </span>{totalRevenue?.toLocaleString()}</b>
            </div>
            <IoStatsChartSharp className='text-[50px] text-[#7928ca]' />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='box bg-white p-5 cursor-pointer hover:bg-[#f1f1f1] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4'>
            <IoIosWarning className='text-[40px] text-[#ff0000]' />
            <div className='info w-[70%]'>
              <h3>Pesanan Pending</h3>
              <b>{totalPending.toLocaleString()}</b>
            </div>
            <IoStatsChartSharp className='text-[50px] text-[#ff0000]' />
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export default DashboardBoxes;
