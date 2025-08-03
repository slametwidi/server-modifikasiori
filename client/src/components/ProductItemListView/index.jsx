import React from 'react'
import "../ProductItem/style.css"
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { FaRegHeart } from "react-icons/fa6";
import { MdZoomOutMap } from "react-icons/md";

const ProductItem = () => {
  return (
    <div className="group productItem relative shadow-lg rounded-md overflow-hidden border-2 border-[rgba(0,0,0,0.1)] ">
        <div className="group imgWrapper w-[100%] overflow-hidden rounded-md relative">
          <Link to="/">
            <div className="img h-[220px] overflow-hidden">
              <img src="/card2.jpg" className="w-full transition-all duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-105" />
              <img src="/card1.jpg" className="w-full" />
            </div>
          </Link>
        </div>

        <div className="actions absolute top-[-200px] right-[5px] z-50 flex items-center gap-2 flex-col w-[50px] transition-all duration-500 group-hover:top-[15px] opacity-0 group-hover:opacity-100">
          <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white hover:!bg-primary hover:text-white group ">
          <MdZoomOutMap className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
          </Button>
          <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white hover:!bg-primary hover:text-white group ">
          <FaRegHeart className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
          </Button>
        </div>

        <div className="info p-3 bg-[#f1f1f1]">
          <h6 className="text-[13px] text-[rgba(0,0,0,0.7)] font-[700]"><Link to="/" className="link transition-all">Mangkok Ganda Custom</Link></h6>
          <h3 className="text-[15px] title mt-1 font-[700] text-black"><Link to="/" className="link transition-all">Mangkok Ganda Custom Type M1 KVB</Link></h3>
        </div>

        <div className="flex items-center gap-4 px-3 mb-2 bg-[#f1f1f1]">
          <span className="oldPrice line-through text-gray-500">Rp.804.000</span>
          <span className="oldPrice text-primary font-bold">Rp.84.000</span>
        </div>
    </div>
  )
}

export default ProductItem;
