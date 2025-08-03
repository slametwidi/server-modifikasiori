import React, { useContext } from 'react'
import { BsInstagram } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { ImWhatsapp } from "react-icons/im";
import { SiShopee } from "react-icons/si";
import { AiFillTikTok } from "react-icons/ai";
import { BsGlobe } from "react-icons/bs";
import { BsShop } from "react-icons/bs";
import { IoChatbubbles } from "react-icons/io5";  
import { IoClose } from "react-icons/io5";
import { IoLogoYoutube } from "react-icons/io";

import CartPanel from '../CartPanel'
import Drawer from '@mui/material/Drawer';
import { MyContext } from '../../App';

const Footer = () => {
    const context = useContext(MyContext);
  return (
    <>
    <footer>
        <div className='py-6'>
            <div className="container">

                <div>
                <div className="flex items-center justify-center gap-8">                  
                    <div className="col flex items-center justify-center flex-col group">
                        <Link to="/" className="flex items-center text-center justify-center flex-col">
                        <div className=" transition-all duration-500 group-hover:text-[#000000] group-hover:-translate-y-3">
                            <h3 className="font-[600] text-[20px] pb-3">Social Media & E-commerce</h3>
                        </div>
                        </Link>
                    </div>
                </div>
                </div>

                <div className="flex items-center justify-center gap-8 pb-5">
                    <div className="col flex items-center justify-center flex-col group">
                        <Link to="/" className="flex items-center text-center justify-center flex-col">
                        <div className=" transition-all duration-500 group-hover:text-[#ff0000] group-hover:-translate-y-3">
                            <BsInstagram className="text-[50px]"/>
                            <h3 className="text-[13px]">Instagram</h3>
                        </div>
                            <p className="text-[18px] font-[700]">@Modifikasiori.id</p>
                        </Link>
                    </div>
                    <div className="col flex items-center justify-center flex-col group">
                        <Link to="/" className="flex items-center text-center justify-center flex-col">
                        <div className=" transition-all duration-500 group-hover:text-[#71ff71] group-hover:-translate-y-3">
                            <ImWhatsapp className="text-[50px]"/>
                            <h3 className="text-[13px]">Whatsaap</h3>
                        </div>
                            <p className="text-[18px] font-[700]">+62 8777-3871-765</p>
                        </Link>
                    </div>
                    <div className="col flex items-center justify-center flex-col group">
                        <Link to="/" className="flex items-center text-center justify-center flex-col">
                        <div className=" transition-all duration-500 group-hover:text-[#000000] group-hover:-translate-y-3">
                            <AiFillTikTok className="text-[50px]"/>
                            <h3 className="text-[13px]">Tiktok</h3>
                        </div>
                            <p className="text-[18px] font-[700]">Modifikasiori</p>
                        </Link>
                    </div>
                    <div className="col flex items-center justify-center flex-col group">
                        <Link to="/" className="flex items-center text-center justify-center flex-col">
                        <div className=" transition-all duration-500 group-hover:text-[#ff0000] group-hover:-translate-y-3">
                            <IoLogoYoutube className="text-[50px]"/>
                            <h3 className="text-[13px]">Youtube</h3>
                        </div>
                            <p className="text-[18px] font-[700]">Modifikasiori</p>
                        </Link>
                    </div>
                    <div className="col flex items-center justify-center flex-col group">
                        <Link to="/" className="flex items-center text-center justify-center flex-col">
                        <div className=" transition-all duration-500 group-hover:text-[#ff0000] group-hover:-translate-y-3">
                            <BsShop className="text-[50px]"/>
                            <h3 className="text-[13px]">E-COMMERCE</h3>
                        </div>
                            <p className="text-[18px] font-[700]">Modifikasi Ori</p>
                        </Link>
                    </div>                    
                    <div className="col flex items-center justify-center flex-col group">
                        <Link to="/" className="flex items-center text-center justify-center flex-col">
                        <div className=" transition-all duration-500 group-hover:text-[#000000] group-hover:-translate-y-3">
                            <BsGlobe className="text-[50px]"/>
                            <h3 className="text-[13px]">Website</h3>
                        </div>
                            <p className="text-[18px] font-[700]">Modifikasiori.com</p>
                        </Link>
                    </div>
                </div>

                <div className="footer flex py-8">
                    <div className="part1 w-[30%]">
                        <h2 className="text-[20px] font-[600]">Kontak Kami</h2>
                        <p>Modifikasi Ori- Toko Racing
                        Katapang, Kab.Bandung
                        </p>

                        <Link className="link" to="modifikasiori@gmail.com">modifikasiori@gmail.com</Link>

                        <span className="text-[20px] font-[600] block w-full mt-3 text-primary">+62 8777 3951 765</span>

                        <div className="flex items-center mt-3">
                        <Link to="/" className="flex items-center">
                            <IoChatbubbles className="text-[45px] text-primary"/>
                            <span className="text-[20px] font-[600] pl-5">Live Chat <br/>
                            Siap Melayani 24 Jam
                            </span>
                        </Link>
                        </div>
                    </div>

                    <div className="part2 w-[35%] border-l border-r border-gray-400 pl-2">
                        <div className="flex items-center justify-center pb-3">                  
                            <div className="col flex items-center justify-center flex-col group">
                                <Link to="/" className="flex items-center text-center justify-center flex-col">
                                <div className=" transition-all duration-500 group-hover:text-[#000000] group-hover:-translate-y-3">
                                    <img src="/logo.png" />
                                </div>
                                </Link>
                            </div>
                        </div>
                        <p className="text-center">Modifikasi Ori Team terus menghadirkan inovasi dan terobosan baru di dunia racing. Kami berkomitmen memberikan produk terbaik hasil dari riset mendalam dan perencanaan matang para ahli di bidang motor balap. Setiap komponen yang kami produksi dirancang khusus untuk meningkatkan performa motor secara optimal, baik untuk penggunaan harian maupun keperluan kompetisi. Dengan pengalaman dan dedikasi tinggi, kami memastikan setiap produk tidak hanya unggul dalam kualitas, tetapi juga mampu memenuhi kebutuhan para pecinta kecepatan.</p>
                    </div>

                    <div className="part3 w-[30%] pl-2">
                        <span className="text-[20px] font-[600] block w-full mt-3 text-primary text-center">FEATURED BRANDS</span>

                        <div className="flex justify-center items-center">
                            <div className="baris1 flex gap-6 mt-2">
                                <img className="w-[60px] h-[60px]" src="/tdr.png"/>
                                <img className="w-[60px] h-[60px]" src="/gates.png"/>
                                <img className="w-[60px] h-[60px]" src="/drpulley.png"/>
                                <img className="w-[60px] h-[60px]" src="/ipone.png"/>
                            </div>
                        </div>
                         <div className="flex justify-center items-center">
                            <div className="baris1 flex gap-6 mt-2">
                                <img className="w-[60px] h-[60px]" src="/motul.png"/>
                                <img className="w-[60px] h-[60px]" src="/proper.png"/>
                                <img className="w-[60px] h-[60px]" src="/brt.png"/>
                                <img className="w-[60px] h-[60px]" src="/Mavic.png"/>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="baris1 flex gap-6 mt-2">
                                <img className="w-[60px] h-[60px]" src="/rcb.png"/>
                                <img className="w-[60px] h-[60px]" src="/umaracing.png"/>
                                <img className="w-[60px] h-[60px]" src="/x1racing.png"/>
                                <img className="w-[60px] h-[60px]" src="/daytona.png"/>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </footer>

    <Drawer open={context.openCartPanel} onClose={context.toggleCartPanel(false)} anchor={"right"} className="cartPanel">
        <div className="flex items-center justify-between py-3 px-4 gap-3 border-b border-[rgba(0,0,0,0.3)]">
          <h4>Keranjang Belanja</h4>
          <IoClose className="text-[20px] cursor-pointer" onClick={context.toggleCartPanel(false)}/>
        </div>

        <CartPanel />
    </Drawer>
    </>
  )
}

export default Footer;