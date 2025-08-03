import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

import ProductItem from '../ProductItem';

const ProductsSlider = ({ products = [], items = 4 }) => {
  return (
    <div className="ProductsSlider py-5">
      <Swiper
        slidesPerView={items}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        {products.map((product, index) => (
          <SwiperSlide key={index}>
            <ProductItem product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductsSlider;
