import React, { useState } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import "../SideBar/style.css"
import {Collapse} from 'react-collapse'
import { FaChevronDown } from "react-icons/fa";
import { Button } from '@mui/material';
import { FaChevronUp } from "react-icons/fa";

const SideBar = () => {

        const [isOpenCategoryFilter, SetIsOpenCategoryFilter] = useState(true);
        const [isOpenProdukFilter, SetIsOpenProdukFilter] = useState(true);
        const [isOpenMotorFilter, SetIsOpenMotorFilter] = useState(true);

  return (
    <aside className="sidebar py-5">
        <div className="box">
            <h3 className="w-full mb-3 text-[16px] font-[900] flex items-center pr-5">Tampilkan Berdasarkan Merk
            <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-black" onClick={()=>SetIsOpenCategoryFilter(!isOpenCategoryFilter)}>
            {
                isOpenCategoryFilter === true ? <FaChevronUp />:<FaChevronDown />
            }
            </Button>
            </h3>
            <Collapse isOpened={isOpenCategoryFilter}>
            <div className="scroll px-4 relative -left-[13px]">
                <FormControlLabel control={<Checkbox size="small"/>} label="Modifikasi Ori" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="X1 Racing" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Daytona" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="BRT" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="TDR" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Dr. Pulley" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="RX7" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Proper" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Uma Racing" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="RCB" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="ARM" className="w-full" />
            </div>
            </Collapse>
        </div>

        <div className="box">
            <h3 className="w-full mb-3 text-[16px] font-[900] flex items-center pr-5">Tampilkan Berdasarkan Produk
            <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-black" onClick={()=>SetIsOpenProdukFilter(!isOpenProdukFilter)}>
            {
                isOpenProdukFilter === true ? <FaChevronUp />:<FaChevronDown />
            }
            </Button>
            </h3>
            <Collapse isOpened={isOpenProdukFilter}>
            <div className="scroll px-4 relative -left-[13px]">
                <FormControlLabel control={<Checkbox size="small"/>} label="Mangkok Custom" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Pulley Set Custom" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Piece Slide" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Noken As" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="V-Belt" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Ramplate" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Persentrik" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Per CVT" className="w-full" />
            </div>
            </Collapse>
        </div>

        <div className="box">
            <h3 className="w-full mb-3 text-[16px] font-[900] flex items-center pr-5">Tampilkan Berdasarkan Jenis Motor
            <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-black" onClick={()=>SetIsOpenMotorFilter(!isOpenMotorFilter)}>
            {
                isOpenMotorFilter === true ? <FaChevronUp />:<FaChevronDown />
            }
            </Button>
            </h3>
            <Collapse isOpened={isOpenMotorFilter}>
            <div className="scroll px-4 relative -left-[13px]">
                <FormControlLabel control={<Checkbox size="small"/>} label="Vario" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="PCX" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="ADV" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Staylo" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="NMAX" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="AEROX" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Lexi" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Beat Karbu" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Scoopy Karbu" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Beat FI" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Beat ESP" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Beat Street" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Beat Deluxe" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Genio" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Scoopy 2021" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Vario 110 FI" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="MIO Sporty" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="MIO J" className="w-full" />
                <FormControlLabel control={<Checkbox size="small"/>} label="Soul GT 115" className="w-full" />
            </div>
            </Collapse>
        </div>

    </aside>
  )
}

export default SideBar;