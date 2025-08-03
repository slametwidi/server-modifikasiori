import Button from '@mui/material/Button';
import React, { useState } from 'react'
import { RiMenu2Fill } from "react-icons/ri";
import { LiaAngleDownSolid } from "react-icons/lia";
import { Link } from 'react-router-dom';
import { MdDeliveryDining } from "react-icons/md";
import CategoryPanel from './CategoryPanel';
import { FaCaretRight } from "react-icons/fa";

import "../Navigation/style.css"

const Navigation = () => {

    const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);

    const openCategoryPanel=()=>{
        setIsOpenCatPanel(true);
    }

  return (
    <>
            <nav className="py-2 bg-white">
        <div className="container flex items-center justify-end gap-8">
            <div className="col_1 w-[20%]">
                <Button className="!text-black gap-2 w-full" onClick={openCategoryPanel}>
                    <RiMenu2Fill className="text-[18px]"/>
                    Menu
                    <LiaAngleDownSolid className="text-[13px] ml-auto font-bold" />
                </Button>
            </div>

            <div className="col_2 w-[60%]">
                <ul className="flex items-center gap-7 nav">
                    <li className="list-none">
                        <Link to="/ProductListing" className="link transition font-[500]">
                            <Button className="link transition !font-[500]">
                                MODIFIKASI ORI
                            </Button>
                        </Link>
                    </li>

                    <li className="list-none relative">
                        <Link to="/" className="link transition font-[500]">
                            <Button className="link transition !font-[500]">
                                X1 RACING
                            </Button>
                        </Link>

                        <div className="submenu absolute top-[120%] left-[0%] min-w-[300px] bg-white shadow-md opacity-0 transition-all">
                            <ul>
                                <li className="list-none relative">
                                    <Button className="flex !justify-between items-center text-[rgba(0,0,0,0.9)] w-full !text-left !rounded-none">Piece Slide <FaCaretRight /></Button>

                                    <div className="submenu absolute top-[0%] left-[100%] min-w-[300px] bg-white shadow-md opacity-0 transition-all">
                                        <ul>
                                            <li className="list-none w-full">
                                                <Link to="/" className="w-full">
                                                <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">Yamaha</Button>
                                                </Link>
                                            </li>
                                            <li className="list-none w-full">
                                                <Link to="/" className="w-full">
                                                <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">Honda</Button>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li className="list-none w-full relative">
                                    <Button className="flex !justify-between items-center text-[rgba(0,0,0,0.9)] w-full !text-left !rounded-none">Per Sentrik<FaCaretRight /></Button>
                                    <div className="submenu absolute top-[0%] left-[100%] min-w-[300px] bg-white shadow-md opacity-0 transition-all">
                                        <ul>
                                            <li className="list-none w-full">
                                                <Link to="/" className="w-full">
                                                <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">1000 Rpm</Button>
                                                </Link>
                                            </li>
                                            <li className="list-none w-full">
                                                <Link to="/" className="w-full">
                                                <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">1200 Rpm</Button>
                                                </Link>
                                            </li>
                                            <li className="list-none w-full">
                                                <Link to="/" className="w-full">
                                                <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">1500 Rpm</Button>
                                                </Link>
                                            </li>
                                            <li className="list-none w-full">
                                                <Link to="/" className="w-full">
                                                <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">2000 Rpm</Button>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li className="list-none w-full relative">
                                    <Button className="flex !justify-between items-center text-[rgba(0,0,0,0.9)] w-full !text-left !rounded-none">Per CVT <FaCaretRight /></Button>
                                    <div className="submenu absolute top-[0%] left-[100%] min-w-[300px] bg-white shadow-md opacity-0 transition-all">
                                        <ul>
                                            <li className="list-none w-full">
                                                <Link to="/" className="w-full">
                                                <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">Yamaha</Button>
                                                </Link>
                                            </li>
                                            <li className="list-none w-full">
                                                <Link to="/" className="w-full">
                                                <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">Honda</Button>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li className="list-none w-full">
                                    <Link to="/" className="w-full">
                                    <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">Noken As</Button>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </li>

                    <li className="list-none relative">
                        <Link to="/" className="link transition text-[10px] font-[500]">
                            <Button className="link transition !font-[500]">
                                DAYTONA
                            </Button>
                        </Link>

                        <div className="submenu absolute top-[120%] left-[0%] min-w-[300px] bg-white shadow-md opacity-0 transition-all">
                            <ul>
                                <li className="list-none w-full">
                                    <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">X1 Racing</Button>
                                </li>
                                <li className="list-none w-full">
                                    <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">TDR</Button>
                                </li>
                                <li className="list-none w-full">
                                    <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">BRT</Button>
                                </li>
                                <li className="list-none w-full">
                                    <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">Daytona</Button>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className="list-none">
                        <Link to="/" className="link transition text-[10px] font-[500]">
                            <Button className="link transition !font-[500]">
                                BRT
                            </Button>
                        </Link>
                    </li>

                    <li className="list-none">
                        <Link to="/" className="link transition text-[10px] font-[500]">
                            <Button className="link transition !font-[500]">
                                TDR
                            </Button>
                        </Link>
                    </li>

                    <li className="list-none">
                        <Link to="/" className="link transition text-[10px] font-[500]">
                            <Button className="link transition !font-[500]">
                                DR.PULLEY
                            </Button>
                        </Link>
                    </li>
                    <li className="list-none relative">
                        <Link to="/" className="link transition text-[10px] font-[500]">
                            <Button className="link transition !font-[500]">
                                LAINNYA&nbsp;
                                <LiaAngleDownSolid className="text-[13px] ml-auto font-bold" />
                            </Button>
                        </Link>

                        <div className="submenu absolute top-[120%] left-[0%] min-w-[300px] bg-white shadow-md opacity-0 transition-all">
                            <ul>
                                <li className="list-none w-full">
                                    <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">RX7</Button>
                                </li>
                                <li className="list-none w-full">
                                    <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">PROPPER</Button>
                                </li>
                                <li className="list-none w-full">
                                    <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">UMA RACING</Button>
                                </li>
                                <li className="list-none w-full">
                                    <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">RCB</Button>
                                </li>
                                <li className="list-none w-full">
                                    <Button className="text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">ARM</Button>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="col_3 w-[15%]">
            <p className="text-[13px] font-[500] flex items-center gap-1 mb-0 mt-0">
                <MdDeliveryDining className="text-[20px]" />
                Service and Upgrade Your Matic!
            </p>
            </div>

        </div>
    </nav>
    
    <CategoryPanel isOpenCatPanel={isOpenCatPanel} setIsOpenCatPanel={setIsOpenCatPanel}/>
    </>
  );
};

export default Navigation;
