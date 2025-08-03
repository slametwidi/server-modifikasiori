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
  const [totalProduk, setTotalProduk] = useState(0);
  const [totalPesanan, setTotalPesanan] = useState(0);
  const [totalOmset, setTotalOmset] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!baseUrl) {
      console.error("REACT_APP_API_BASE_URL is not defined");
      return;
    }

    fetch(`${baseUrl}/api/products/count`)
      .then(res => res.json())
      .then(data => setTotalProduk(data.total))
      .catch(err => console.error('Error fetch total produk:', err));
  }, [baseUrl]);

  useEffect(() => {
    if (!baseUrl) {
      return;
    }

    fetch(`${baseUrl}/api/orders/count`)
      .then(res => res.json())
      .then(data => setTotalPesanan(data.total))
      .catch(err => console.error('Error fetch total pesanan:', err));
  }, [baseUrl]);

  useEffect(() => {
    if (!baseUrl) {
      return;
    }

    fetch(`${baseUrl}/api/orders/revenue`)
      .then(res => res.json())
      .then(data => setTotalOmset(data.total))
      .catch(err => console.error('Error fetch total omset:', err));
  }, [baseUrl]);

  useEffect(() => {
    if (!baseUrl) {
      return;
    }

    fetch(`${baseUrl}/api/orders/count/pending`)
      .then(res => res.json())
      .then(data => setTotalPending(data.count))
      .catch(err => console.error('Error fetch total pending:', err));
  }, [baseUrl]);

  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        navigation
        modules={[Navigation]}
        className="dashboardBoxesSlider"
      >
        {/* Total Pesanan */}
        <SwiperSlide>
          <div className='box bg-white p-5 cursor-pointer hover:bg-[#f1f1f1] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4'>
            <FaGift className='text-[30px] text-[#3872fa]' />
            <div className='info w-[70%]'>
              <h3>Total Pesanan</h3>
              <b>{totalPesanan.toLocaleString()}</b>
            </div>
            <IoStatsChartSharp className='text-[50px] text-[#3872fa]' />
          </div>
        </SwiperSlide>

        {/* Total Produk */}
        <SwiperSlide>
          <div className='box bg-white p-5 cursor-pointer hover:bg-[#f1f1f1] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4'>
            <FaProductHunt className='text-[30px] text-[#10b981]' />
            <div className='info w-[70%]'>
              <h3>Total Produk</h3>
              <b>{totalProduk.toLocaleString()}</b>
            </div>
            <IoStatsChartSharp className='text-[50px] text-[#10b981]' />
          </div>
        </SwiperSlide>

        {/* Total Omset */}
        <SwiperSlide>
          <div className='box bg-white p-5 cursor-pointer hover:bg-[#f1f1f1] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4'>
            <FaChartLine className='text-[30px] text-[#7928ca]' />
            <div className='info w-[70%]'>
              <h3>Total Omset</h3>
              <b>Rp. {totalOmset.toLocaleString()}</b>
            </div>
            <IoStatsChartSharp className='text-[50px] text-[#7928ca]' />
          </div>
        </SwiperSlide>

        {/* Pesanan Pending */}
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
};

export default DashboardBoxes;
