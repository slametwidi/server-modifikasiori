import React from 'react'
import "../Search/style.css"
import Button from '@mui/material/Button';
import { IoSearchSharp } from "react-icons/io5";

const Search = () => {
  return (
    <div className="searchBox w-[100%] h-[50px] bg-[#e5e5e5] rounded-[5px] relative p-2">
        <input type="text" placeholder="Cari Produk" className="w-full h-[35px] focus:outline-none bg-inherit p-2 text-[15px]" />
        <Button className="!absolute top-[8px] right-[5px] z-50 !w-[35px] !min-w-[37px] h-[35px] !rounded-full !text-[#000000]"><IoSearchSharp className="text-[#5e5e5e] text-[22px]"/></Button>
    </div>
  )
}

export default Search;