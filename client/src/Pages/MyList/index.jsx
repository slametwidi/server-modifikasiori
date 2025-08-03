import React, { useState } from 'react'

import { Button, Menu, MenuItem } from '@mui/material';
import { IoMdCloudUpload } from "react-icons/io";
import { IoCart } from "react-icons/io5";
import MyListItem from './myListItem';
import AccountSidebar from '../../components/AccountSidebar';

const MyList = () => {
  return (

    <section className="py-10 w-full">
        <div className="container flex gap-5">

            <div className="col1 w-[20%]">
            <AccountSidebar />
            </div>

            <div className="col2 w-[70%]">
                <div className="shadow-md rounded-md bg-white">
                    <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)]">
                        <h2 className="font-[900]">DATA PRODUK YANG ANDA SUKAI</h2>
                        <p className="mt-0">Anda menyimpan <span className="font-bold text-primary">4</span> Produk yang anda masukan ke dalam list produk yang anda sukai</p>
                    </div>

                    <MyListItem />

                </div>
            </div>
        </div>
    </section>
  )
}

export default MyList;