import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation, Autoplay } from 'swiper/modules';

const HomeSlider = () => {
  return (
    <div className="homeSlider py-4">
        <div className="container">
            <Swiper 
                spaceBetween={10}
                navigation={true}
                modules={[Navigation, Autoplay]}
                autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                }}
                className="sliderHome"
            >
                <SwiperSlide>
                    <div className="item rounded-[20px] h-[450px] overflow-hidden">
                    <img className="w-full" src="/banner1.webp" alt="bannerslide"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="item rounded-[20px] h-[450px] overflow-hidden">
                    <img className="w-full" src="/banner2.webp" alt="bannerslide"/>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="item rounded-[20px] h-[450px] overflow-hidden">
                    <img className="w-full" src="/banner1.webp" alt="bannerslide"/>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    </div>
  );
}

export default HomeSlider;
