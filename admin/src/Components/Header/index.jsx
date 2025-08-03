import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { RiMenu2Line } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import { MyContext } from '../../App'; // asumsi Context berada di App.jsx

const Header = () => {
  const navigate = useNavigate();  // ← Tambahkan useNavigate
  const { setIsLogin, setUser } = useContext(MyContext); // jika kamu simpan user di context

  const handleLogout = () => {
    // Hapus data dari localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Update Context
    setIsLogin(false);
    setUser(null);

    // Redirect ke halaman login
    navigate('/login', { replace: true });
  };

  return (
    <header className="w-full h-[auto] py-2 pl-72 pr-7 bg-white shadow-md flex items-center justify-between border-b border-[rgba(0,0,0,0.2)]">
      <div className="part1">
        <Button className='!h-[40px] !w-[40px] !min-w-[40px] !rounded-full !text-[rgba(0,0,0,0.8)]'>
          <RiMenu2Line className='text-[18px] text-[rgba(0,0,0,0.8)]' />
        </Button>
      </div>

      <div className='part2 w-[40%] flex items-center justify-end gap-1'>
        <Button
          onClick={handleLogout}
          className='items-center flex gap-3 py-2 hover:!bg-[rgba(0,0,0,0.1)] !text-[rgba(0,0,0,0.8)]'
        >
          <MdLogout className='text-[18px] text-[rgba(0,0,0,0.8)]' />Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
