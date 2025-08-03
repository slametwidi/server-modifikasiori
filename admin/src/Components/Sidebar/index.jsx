import { Button, Divider } from '@mui/material';
import React, { useState, useContext  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiDashboardLine } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa";
import {Collapse} from 'react-collapse';
import { FaImages } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { RiProductHuntLine } from "react-icons/ri";
import { LuUsers } from "react-icons/lu";
import { TbShoppingCartShare } from "react-icons/tb";
import { MdLogout } from "react-icons/md";
import { MyContext } from '../../App';
import { menuItems } from './sidebarMenu';
import { MdOutlinePayments } from "react-icons/md";

const iconMap = {
  dashboard: <RiDashboardLine className='text-[18px]' />,
  banner: <FaImages className='text-[18px]' />,
  kategori: <BiCategory className='text-[18px]' />,
  products: <RiProductHuntLine className='text-[18px]' />,
  users: <LuUsers className='text-[18px]' />,
  orders: <TbShoppingCartShare className='text-[18px]' />,
  datapesanan: <TbShoppingCartShare className='text-[18px]' />,
  dpaccounting: <TbShoppingCartShare className='text-[18px]' />,
  pembayaran: <MdOutlinePayments className='text-[18px]' />
};

const Sidebar = () => {
  const [openKey, setOpenKey] = useState(null);
  const { setIsOpenFullScreenPanel } = useContext(MyContext);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <div className='sidebar fixed top-0 left-0 bg-white w-[18%] h-full border-r shadow-md py-2 px-2 overflow-auto'>
      <div className='py-2 w-full'><Link to='/'><img src='/logo.png' className='w-full p-2' /></Link></div>
      <ul className='mt-4'>
        {menuItems.map(item => {
          if (!item.roles.includes(user.role)) return null;
          const isOpen = openKey === item.key;
          return (
            <li key={item.key}>
              {item.sub ? (
                <>
                  <Button
                    className='items-center w-full !justify-start flex gap-3 py-2 hover:!bg-[rgba(0,0,0,0.1)]'
                    onClick={() => setOpenKey(isOpen ? null : item.key)}
                  >
                    {iconMap[item.key]}<span>{item.label}</span>
                    <FaAngleDown className={`ml-auto transition-transform ${isOpen?'rotate-180':''}`} />
                  </Button>
                  <Collapse isOpened={isOpen}>
                    <ul className='w-full'>
                      {item.sub.map(sub => (
                        <li key={sub.key}>
                          {sub.action === 'openModal' ? (
                            <Button
                              className='w-full justify-start pl-9 py-2 hover:!bg-[rgba(0,0,0,0.1)]'
                              onClick={() => setIsOpenFullScreenPanel({ open: true, model: 'Tambah Data Produk Baru' })}
                            >
                              {sub.label}
                            </Button>
                          ) : (
                            <Link to={sub.to}>
                              <Button className='w-full justify-start pl-9 py-2 hover:!bg-[rgba(0,0,0,0.1)]'>{sub.label}</Button>
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </Collapse>
                </>
              ) : (
                <Link to={item.to}>
                  <Button className='items-center w-full justify-start flex gap-3 py-2 hover:!bg-[rgba(0,0,0,0.1)]'>
                    {iconMap[item.key]}<span>{item.label}</span>
                  </Button>
                </Link>
              )}
            </li>
          );
        })}
        <li>
          <Button
            onClick={handleLogout}
            className='items-center w-full justify-start flex gap-3 py-2 hover:!bg-[rgba(0,0,0,0.1)]'
          >
            <MdLogout className='text-[18px]' />Logout
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;