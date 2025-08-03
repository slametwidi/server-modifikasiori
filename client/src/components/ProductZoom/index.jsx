import React, { useRef, useState } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';

export const ProductZoom = () => {

    const [slideIndex, setSlideIndex] = useState(0);
    const zoomSliderBig = useRef();
    const zoomSliderSml = useRef();

    const goto = (index) => {
        setSlideIndex(index);
        zoomSliderSml.current.swiper.slideTo(index);
        zoomSliderBig.current.swiper.slideTo(index);
    }

  return (
    <>
    <div className="flex gap-3">
    <div className="slider w-[80%]">
        <Swiper
            ref={zoomSliderSml}
            direction={"vertical"}
            slidesPerView={4}
            spaceBetween={10}
            navigation={true}
            modules={[Navigation]}
            className="zoomProductSliderThumbs h-[450px] overflow-hidden"
        >
            <SwiperSlide>
                <div className={`item rounded-md overflow-hidden cursor-pointer group ${slideIndex===0 ? 'opacity-1' : 'opacity-30'}`} onClick={()=> goto(0)}>
                <img className="w-full transition-all group-hover:scale-105" src="/cvt1.jpg" /></div>
            </SwiperSlide>

        </Swiper>
    </div>
        <div className="zoomContainer w-{85%] overflow-hidden">
        <Swiper
            ref={zoomSliderBig}
            slidesPerView={1}
            spaceBetween={0}
            navigation={false}
        >

        </Swiper>
        </div>
    </div>
    </>
  )
}
