import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

const CategoryCollapse = () => {
        const [submenuIndex, setSubmenuIndex] = useState (null);
    const [InnerSubmenuIndex, setInnerSubmenuIndex] = useState (null);

    const openSubmenu = (index)=>{
        if(submenuIndex===index){
            setSubmenuIndex(null);
        }else{
            setSubmenuIndex(index);
        }
    }

    const openInnerSubmenu = (index)=>{
        if(InnerSubmenuIndex===index){
            setInnerSubmenuIndex(null);
        }else{
            setInnerSubmenuIndex(index);
        }
    }
  return (
    <>
         <div className="scroll">
            <ul className="w-full">

                <li className="list-none flex items-center relative flex-col">
                    <Link to="/" className="w-full">
                    <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.7)] !text-[13px]">Warehouse Modifikasi Ori</Button>
                    </Link>
                </li>

                <li className="list-none flex items-center relative flex-col">
                    <Link to="/" className="w-full">
                    <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.7)] !text-[13px]">Produk Katalog</Button>
                    </Link>
                </li>

                <li className="list-none flex items-center relative flex-col">
                    <Link to="/" className="w-full">
                    <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.7)] !text-[13px]">Teknikal Service</Button>
                    </Link>
                </li>

                <li className="list-none flex items-center relative flex-col">
                    <Link to="/" className="w-full">
                    <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.7)] !text-[13px]">Produksi</Button>
                    </Link>
                </li>

                <li className="list-none flex items-center relative flex-col">
                    <Link to="/" className="w-full">
                    <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.7)] !text-[13px]">Inventori</Button>
                    </Link>
                </li>

                <li className="list-none flex items-center relative flex-col">
                    <Link to="/" className="w-full">
                    <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.7)] !text-[13px]">Marketing</Button>
                    </Link>
                </li>

                <li className="list-none flex items-center relative flex-col">
                    <Link to="/" className="w-full">
                    <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.7)] !text-[13px]">Akunting</Button>
                    </Link>
                </li>

                <li className="list-none flex items-center relative flex-col">
                    <Link to="/" className="w-full">
                    <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.7)] !text-[13px]">Kasir</Button>
                    </Link>
                </li>

                <li className="list-none flex items-center relative flex-col">
                    <Link to="/" className="w-full">
                    <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.7)] !text-[13px]">Absen</Button>
                    </Link>
                </li>

                <li className="list-none flex items-center relative flex-col">
                    <Link to="/" className="w-full">
                    <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.7)] !text-[13px]">Ide Proposal</Button>
                    </Link>
                </li>

                <li className="list-none flex items-center relative flex-col">
                    <Link to="/" className="w-full">
                    <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.7)] !text-[13px]">KPI</Button>
                    </Link>
                </li>

                <li className="list-none flex items-center relative flex-col">
                    <Link to="/" className="w-full">
                    <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.7)] !text-[13px]">Kategori Produk</Button>
                    </Link>

                    {
                        submenuIndex === 0 ? (
                    <FaChevronDown className="absolute top-[10px] right-[15px]" onClick={()=>openSubmenu(0)} />
                    ) : (
                        <FaChevronUp className="absolute top-[10px] right-[15px]" onClick={()=>openSubmenu(0)} />
                    )
                    }

                    {
                        submenuIndex===0 && (
                            <ul className="submenu w-full pl-3">
                                <li className="list-none relative flex-col">
                                <Link to="/" className="w-full">
                                <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.7)]">Beat</Button>
                                </Link>

                                {
                                    InnerSubmenuIndex === 0 ? (
                                <FaChevronDown className="absolute top-[10px] right-[15px]" onClick={()=>openInnerSubmenu(0)} />
                                ) : (
                                    <FaChevronUp className="absolute top-[10px] right-[15px]" onClick={()=>openInnerSubmenu(0)} />
                                )
                                }

                                {
                                    InnerSubmenuIndex===0 && (
                                        <ul className="inner_submenu w-full pl-3">
                                <li className="list-none relative mb-1">
                                    <Link to="/" className="link w-full !text-left !justify-start !px-3 transition text-[14px]">X1 Racing</Link>
                                </li>
                                <li className="list-none relative mb-1">
                                    <Link to="/" className="link w-full !text-left !justify-start !px-3 transition text-[14px]">Daytona</Link>
                                </li>
                                </ul>
                                    )
                                }
                        </li>
                    </ul>
                    )
                    }
                </li>
            </ul>
        </div>
    </>
  )
}

export default CategoryCollapse;
