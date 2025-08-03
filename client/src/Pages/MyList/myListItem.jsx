import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Form } from 'react-router-dom'
import { IoMdCloseCircleOutline } from "react-icons/io";
import { GoTriangleDown } from "react-icons/go";
import { Button, Menu, MenuItem } from '@mui/material';

const MyListItem = (props) => {

  return (
    <div>
    <div className="cartItem w-full p-3 flex items-center gap-4 border-b border-[rgba(0,0,0,0.2)]">
        <div className="img w-[10%] rounded-md overflow-hidden">
            <Link to="/product/8127" className="group">
                <img src="/cvt1.jpg" className="w-full group-hover:scale-105 transition-all" />
            </Link>
        </div>
                        
        <div className="info w-[90%] relative">
            <IoMdCloseCircleOutline className="cursor-pointer absolute top-[0px] right-[0px] text-[20px] link transition-all" />
                <span className="text-[13px]"><Link className="link">X1 RACING TEAM</Link></span>
                <h3 className="text-[18px] font-[600]"><Link className="link">Per CVT X1 Racing</Link></h3>

                <div className="flex items-center gap-4 mb-2">
                    <span className="oldPrice text-primary font-bold">Rp.84.000</span>
                </div>

                <Button className="btn-org btn-sm mt-2 mb-2">Masukan Ke Keranjang</Button>
        </div>
    </div>
    <div className="cartItem w-full p-3 flex items-center gap-4 border-b border-[rgba(0,0,0,0.2)]">
        <div className="img w-[10%] rounded-md overflow-hidden">
            <Link to="/product/8127" className="group">
                <img src="/cvt1.jpg" className="w-full group-hover:scale-105 transition-all" />
            </Link>
        </div>
                        
        <div className="info w-[90%] relative">
            <IoMdCloseCircleOutline className="cursor-pointer absolute top-[0px] right-[0px] text-[20px] link transition-all" />
                <span className="text-[13px]"><Link className="link">X1 RACING TEAM</Link></span>
                <h3 className="text-[18px] font-[600]"><Link className="link">Per CVT X1 Racing</Link></h3>

                <div className="flex items-center gap-4 mb-2">
                    <span className="oldPrice text-primary font-bold">Rp.84.000</span>
                </div>

                <Button className="btn-org btn-sm mt-2 mb-2">Masukan Ke Keranjang</Button>
        </div>
    </div>
    <div className="cartItem w-full p-3 flex items-center gap-4 border-b border-[rgba(0,0,0,0.2)]">
        <div className="img w-[10%] rounded-md overflow-hidden">
            <Link to="/product/8127" className="group">
                <img src="/cvt1.jpg" className="w-full group-hover:scale-105 transition-all" />
            </Link>
        </div>
                        
        <div className="info w-[90%] relative">
            <IoMdCloseCircleOutline className="cursor-pointer absolute top-[0px] right-[0px] text-[20px] link transition-all" />
                <span className="text-[13px]"><Link className="link">X1 RACING TEAM</Link></span>
                <h3 className="text-[18px] font-[600]"><Link className="link">Per CVT X1 Racing</Link></h3>

                <div className="flex items-center gap-4 mb-2">
                    <span className="oldPrice text-primary font-bold">Rp.84.000</span>
                </div>

                <Button className="btn-org btn-sm mt-2 mb-2">Masukan Ke Keranjang</Button>
        </div>
    </div>
    <div className="cartItem w-full p-3 flex items-center gap-4 border-b border-[rgba(0,0,0,0.2)]">
        <div className="img w-[10%] rounded-md overflow-hidden">
            <Link to="/product/8127" className="group">
                <img src="/cvt1.jpg" className="w-full group-hover:scale-105 transition-all" />
            </Link>
        </div>
                        
        <div className="info w-[90%] relative">
            <IoMdCloseCircleOutline className="cursor-pointer absolute top-[0px] right-[0px] text-[20px] link transition-all" />
                <span className="text-[13px]"><Link className="link">X1 RACING TEAM</Link></span>
                <h3 className="text-[18px] font-[600]"><Link className="link">Per CVT X1 Racing</Link></h3>

                <div className="flex items-center gap-4 mb-2">
                    <span className="oldPrice text-primary font-bold">Rp.84.000</span>
                </div>

                <Button className="btn-org btn-sm mt-2 mb-2">Masukan Ke Keranjang</Button>
        </div>
    </div>
    </div>
  )
}

export default MyListItem;