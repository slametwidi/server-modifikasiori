import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

const HomeCatSlider = () => {
  return (
    <div className="HomeCatSlider pt-1 py-6">
        <div className="container">
            <div className="flex items-center justify-center gap-10">
                <div className="col_1 w-[50%] flex-col">
                <h2 className="text-center text-[25px] font-[600]">YAMAHA</h2>
                <Swiper
                    slidesPerView={5}
                    spaceBetween={1}
                    navigation={true}
                    modules={[Navigation]}
                    className="mySwiper"
                >

                    <SwiperSlide>
                        <Link to="/ProductListing">
                            <div className="item py-5 px-3 bg-white rounded-lg text-center flex flex-col justify-center items-center">
                                <img src="/tmax.jpg" className="transition-all"></img>
                                <h3 className="text-[15px] font-[500] mt-3">T-MAX</h3>
                            </div>
                        </Link>
                    </SwiperSlide>

                    <SwiperSlide>
                        <Link to="/ProductListing">
                            <div className="item py-5 px-3 bg-white rounded-lg text-center flex flex-col justify-center items-center">
                                <img src="/xmax.jpg" />
                                <h3 className="text-[15px] font-[500] mt-3">X-MAX 2023</h3>
                            </div>
                        </Link>
                    </SwiperSlide>

                    <SwiperSlide>
                        <Link to="/ProductListing">
                            <div className="item py-5 px-3 bg-white rounded-lg text-center flex flex-col justify-center items-center">
                                <img src="/allnewnmax.jpg" />
                                <h3 className="text-[15px] font-[500] mt-3">All New NMAX</h3>
                            </div>
                        </Link>
                    </SwiperSlide>

                    <SwiperSlide>
                        <Link to="/ProductListing">
                            <div className="item py-5 px-3 bg-white rounded-lg text-center flex flex-col justify-center items-center">
                                <img src="/nmax.jpg" />
                                <h3 className="text-[15px] font-[500] mt-3">NMAX-155</h3>
                            </div>
                        </Link>
                    </SwiperSlide>

                    <SwiperSlide>
                        <Link to="/ProductListing">
                            <div className="item py-5 px-3 bg-white rounded-lg text-center flex flex-col justify-center items-center">
                                <img src="/allnewaerox.jpg" />
                                <h3 className="text-[15px] font-[500] mt-3">All New Aerox</h3>
                            </div>
                        </Link>
                    </SwiperSlide>

                    <SwiperSlide>
                        <Link to="/ProductListing">
                            <div className="item py-5 px-3 bg-white rounded-lg text-center flex flex-col justify-center items-center">
                                <img src="/aerox.jpg" />
                                <h3 className="text-[15px] font-[500] mt-3">AEROX</h3>
                            </div>
                        </Link>
                    </SwiperSlide>

                    <SwiperSlide>
                        <Link to="/ProductListing">
                            <div className="item py-5 px-3 bg-white rounded-lg text-center flex flex-col justify-center items-center">
                                <img src="/fazzio.jpg" />
                                <h3 className="text-[15px] font-[500] mt-3">FAZZIO</h3>
                            </div>
                        </Link>
                    </SwiperSlide>

                </Swiper>
                </div>
                <div className="col_1 w-[50%] flex-col">
                <h2 className="text-center text-[25px] font-[600]">HONDA</h2>
                <Swiper
                    slidesPerView={5}
                    spaceBetween={1}
                    navigation={true}
                    modules={[Navigation]}
                    className="mySwiper"
                >

                    <SwiperSlide>
                        <Link to="/ProductListing">
                            <div className="item py-5 px-3 bg-white rounded-lg text-center flex flex-col justify-center items-center">
                                <img src="/pcx160.jpg" className="transition-all"></img>
                                <h3 className="text-[15px] font-[500] mt-3">PCX 160</h3>
                            </div>
                        </Link>
                    </SwiperSlide>

                    <SwiperSlide>
                        <Link to="/ProductListing">
                            <div className="item py-5 px-3 bg-white rounded-lg text-center flex flex-col justify-center items-center">
                                <img src="/pcx150.jpg" />
                                <h3 className="text-[15px] font-[500] mt-3">PCX 150</h3>
                            </div>
                        </Link>
                    </SwiperSlide>

                    <SwiperSlide>
                        <Link to="/ProductListing">
                            <div className="item py-5 px-3 bg-white rounded-lg text-center flex flex-col justify-center items-center">
                                <img src="/vario.jpg" />
                                <h3 className="text-[15px] font-[500] mt-3">VARIO 160</h3>
                            </div>
                        </Link>
                    </SwiperSlide>

                    <SwiperSlide>
                        <Link to="/ProductListing">
                            <div className="item py-5 px-3 bg-white rounded-lg text-center flex flex-col justify-center items-center">
                                <img src="/adv.jpg" />
                                <h3 className="text-[15px] font-[500] mt-3">ADV-150</h3>
                            </div>
                        </Link>
                    </SwiperSlide>

                    <SwiperSlide>
                        <Link to="/ProductListing">
                            <div className="item py-5 px-3 bg-white rounded-lg text-center flex flex-col justify-center items-center">
                                <img src="/crf.jpg" />
                                <h3 className="text-[15px] font-[500] mt-3">CRF 150</h3>
                            </div>
                        </Link>
                    </SwiperSlide>

                    <SwiperSlide>
                        <Link to="/ProductListing">
                            <div className="item py-5 px-3 bg-white rounded-lg text-center flex flex-col justify-center items-center">
                                <img src="/beat.jpg" />
                                <h3 className="text-[15px] font-[500] mt-3">BEAT FI ESP</h3>
                            </div>
                        </Link>
                    </SwiperSlide>

                    <SwiperSlide>
                        <Link to="/ProductListing">
                            <div className="item py-5 px-3 bg-white rounded-lg text-center flex flex-col justify-center items-center">
                                <img src="/fazzio.jpg" />
                                <h3 className="text-[15px] font-[500] mt-3">FAZZIO</h3>
                            </div>
                        </Link>
                    </SwiperSlide>

                </Swiper>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HomeCatSlider;
