import React from 'react'
import { Button } from '@mui/material';
import { CiBoxList } from "react-icons/ci";
import { FaRegHeart } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import { NavLink } from "react-router";
import { RiDashboard2Fill } from "react-icons/ri";
import { MdOutlinePayments } from "react-icons/md";

const AccountSidebar = () => {
  return (
    <div className="card bg-white shadow-md rounded-md sticky top-[10px]">
                    <div className="w-full p-3 flex items-center justify-center flex-col">
                        <div className="w-[110px] h-[110px] rounded-full overflow-hidden">
                            <img src="/logo1.png" className="w-full h-full object-cover" />
                        </div>
                        <h2 className="font-[900]">Modifikasi Ori</h2>
                    </div>

                    <ul className="list-none pb-5 myAccountTabs">

                        <li className="w-full">
                        <NavLink to="/dashboard" exact={true} activeClassName="isActive">
                            <Button className="w-full !text-left !justify-start !px-5 !capitalize text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2">
                            <RiDashboard2Fill className="text-[17px]" /> Dashboard
                            </Button>
                        </NavLink>
                        </li>

                        <li className="w-full">
                        <NavLink to="/my-orders" exact={true} activeClassName="isActive">
                            <Button className="w-full !text-left !justify-start !px-5 !capitalize text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2">
                            <CiBoxList className="text-[17px]" /> Status Orderan
                            </Button>
                        </NavLink>
                        </li>

                        <li className="w-full">
                        <NavLink to="/tagihan" exact={true} activeClassName="isActive">
                            <Button className="w-full !text-left !justify-start !px-5 !capitalize text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2">
                            <MdOutlinePayments className="text-[17px]" /> Pembayaran dan Tagihan
                            </Button>
                        </NavLink>
                        </li>

                        <li className="w-full">
                        <NavLink to="/my-list" exact={true} activeClassName="isActive">
                            <Button className="w-full !text-left !justify-start !px-5 !capitalize text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2">
                            <FaRegHeart className="text-[17px]" /> Produk Yang Anda Sukai
                            </Button>
                        </NavLink>
                        </li>

                        <li className="w-full">
                        <NavLink to="/login" exact={true} activeClassName="isActive">
                            <Button className="w-full !text-left !justify-start !px-5 !capitalize text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2">
                            <IoIosLogOut className="text-[17px]" /> Keluar Akun
                            </Button>
                        </NavLink>
                        </li>
                    </ul>
                </div>
  )
}

export default AccountSidebar;