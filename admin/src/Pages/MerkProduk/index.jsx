import { Button } from '@mui/material';
import React, { useContext } from 'react'
import { MdOutlineAddBox } from "react-icons/md";
import { PiExportBold } from "react-icons/pi";
import { MdOutlineFilterAlt } from "react-icons/md";
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import { CiEdit } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { IoTrashOutline } from "react-icons/io5";
import { MyContext } from '../../App';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const MerkProdukList = () => {

    const { setIsOpenFullScreenPanel } = useContext(MyContext);
    const context = useContext(MyContext);

  return (
    <>
        <div className='card bg-white shadow-md rounded-md p-5'>
            <h1 className='font-[700] text-[20px] text-gray-800 text-center'>Data Home Banner Slide Modifikasi Ori</h1>
        </div>

<div className='card my-3 shadow-md sm:rounded-lg bg-white'>

      <div className="relative overflow-x-auto p-5">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3" width="10%">
                                        <div className='w=[60px]'><Checkbox className='!text-white' {...label} size='small' /></div>
                                        </th>
                                        <th scope="col" className=" py-3 w-1/12">Gambar</th>
                                        <th scope="col" className=" py-3 w-1/12">Kategori</th>
                                        <th scope="col" className="px-6 py-2 text-center">AKSI</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200'>
                                        <td className="px-6 py-3">
                                            <div className='w=[60px]'><Checkbox className='!text-white' {...label} size='small' /></div>
                                        </td>
                                        <td className="py-2 w-[50%]">
                                            <div className='flex items-center gap-4'>
                                                <div className='img w-[100px] h-[100px] rounded-md overflow-hidden group'>
                                                    <Link to='/'><img className='w-full h-full group-hover:scale-105 transition-all' src='/x1racing.png'/></Link>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2 w-[40%]">
                                            <div className='flex items-center'>
                                                <div className='info w-[75%]'>
                                                    <Link to='/'>
                                                        <h3 className='font-[600] text-[14px] leading-5  hover:text-[#ff7b7b]'>
                                                            X1 RACING
                                                        </h3>
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2 text-center w-[10%]">
                                            <div className=' flex items-center justify-center gap-2'>
                                            <Tooltip title="Edit" placement="bottom">
                                                <Button className='!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)]' style={{minWidth:'15px'}}>
                                                    <CiEdit className='text-[20px] text-[#f1f1f1]' />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Lihat" placement="bottom">
                                                <Button className='!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)]' style={{minWidth:'15px'}}>
                                                    <IoEyeOutline className='text-[20px] text-[#f1f1f1]' />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Hapus" placement="bottom">
                                                <Button className='!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)]' style={{minWidth:'15px'}}>
                                                    <IoTrashOutline className='text-[20px] text-[#f1f1f1]' />
                                                </Button>
                                            </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200'>
                                        <td className="px-6 py-3">
                                            <div className='w=[60px]'><Checkbox className='!text-white' {...label} size='small' /></div>
                                        </td>
                                        <td className="py-2 w-[50%]">
                                            <div className='flex items-center gap-4'>
                                                <div className='img w-[100px] h-[100px] rounded-md overflow-hidden group'>
                                                    <Link to='/'><img className='w-full h-full group-hover:scale-105 transition-all' src='/Mavic.png'/></Link>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2 w-[40%]">
                                            <div className='flex items-center'>
                                                <div className='info w-[75%]'>
                                                    <Link to='/'>
                                                        <h3 className='font-[600] text-[14px] leading-5  hover:text-[#ff7b7b]'>
                                                            Mavic
                                                        </h3>
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2 text-center w-[10%]">
                                            <div className=' flex items-center justify-center gap-2'>
                                            <Tooltip title="Edit" placement="bottom">
                                                <Button className='!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)]' style={{minWidth:'15px'}}>
                                                    <CiEdit className='text-[20px] text-[#f1f1f1]' />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Lihat" placement="bottom">
                                                <Button className='!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)]' style={{minWidth:'15px'}}>
                                                    <IoEyeOutline className='text-[20px] text-[#f1f1f1]' />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Hapus" placement="bottom">
                                                <Button className='!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)]' style={{minWidth:'15px'}}>
                                                    <IoTrashOutline className='text-[20px] text-[#f1f1f1]' />
                                                </Button>
                                            </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className='flex items-center justify-center pt-4 pb-4'>
                            <Pagination count={10} />
                        </div>
    </div>
    </>
  )
}

export default MerkProdukList;