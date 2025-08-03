import React, {useState} from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import UploadBox from '../../Components/UploadBox';
import { Button } from '@mui/material';
import { RiUploadCloud2Line } from "react-icons/ri";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Vario',
  'PCX',
  'ADV',
  'Staylo',
  'NMAX',
  'AEROX',
  'LEXI',
  'Beat Karbu',
  'Scoppy Karbu',
  'Beat FI',
];


const AddMotor = () => {

  return (
    <section className='p-5 bg-[#f1f1f1]'>
        <form className='form py-3 p-8'>

        <div className='grid grid-cols-1 mb-3 w-[200px]'>
            <div className='col'>
                <h3 className='text-[14px] font-[500] mb-1'>Nama Merk Motor</h3>
                <input type='text' 
                className='w-full h-[35px] border border-[rgba(0,0,0,0.4)] focus:outline-none focus:border-[rgba(0,0,0,0.9)] rounded-md p-3 text-sm'></input>
            </div>
        </div>

        <div className='col w-full p-2 px-0'>
            <h3 className='font-[700] text-[18px]'>Upload Gambar</h3>
            <div className='grid grid-cols-6'>
            <UploadBox />
            </div>
        </div>

        <br />

        <Button type='submit' className='btn-blue btn-lg flex items-center gap-3 w-[200px]'>
        <RiUploadCloud2Line className='text-[40px] text-white' />
        <span className='text-[10px]'>Simpan Data dan Publish Produk</span>
        </Button>
        </form>
    </section>
  )
}

export default AddMotor;