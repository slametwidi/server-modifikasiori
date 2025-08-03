import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import Search from '../Search';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";
import Tooltip from '@mui/material/Tooltip';
import Navigation from './Navigation';
import { MyContext } from '../../App';
import { Button, ListItemIcon } from '@mui/material';
import { FaUserAstronaut } from "react-icons/fa";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { CiBoxList } from "react-icons/ci";
import { CiViewList } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { LuLogIn } from "react-icons/lu";
import { useCart } from '../CartContext';
import Avatar from '@mui/material/Avatar';
import { AuthContext } from '../Auth/AuthContext';
import { VscAccount } from "react-icons/vsc";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Header = () => {
    const { user } = useContext(AuthContext);
    const { cart } = useCart();
    const count = cart.products?.length || 0;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
  localStorage.removeItem("isLogin"); // kalau kamu simpan ini
  context.setIsLogin(false); // update context
  window.location.href = "/login"; // redirect ke login page
};

    const context = useContext(MyContext)

  return (
    <header className="bg-[#f5f0f0]">
        <div className="bg-black header py-4 border-gray-300 border-b-[1px]">
            <div className="container flex items-center justify-between">
                <div className="col1 w-[25%]">
                    <Link to={"/"}><img src="/logobaru1.png" /></Link>
                </div>

                <div className="col2 w-[50%]">
                <Search />
                </div>

                <div className="col3 w-[25%] flex items-center pl-7">
                    <ul className="flex items-center justify-between w-full">
                        

                        {
                    context.isLogin === false ? 

                        <li className="list-none text-white">
                            
                        </li>

                        : (
                            <>
                            <div className="flex items-center gap-3">
                        <li>
                            <Tooltip title="Keranjang">
                                <IconButton aria-label="cart" onClick={()=> context.setOpenCartPanel(true)}>
                                    <StyledBadge badgeContent={count} color="secondary">
                                        <MdOutlineShoppingCart className="text-white" />
                                    </StyledBadge>
                                </IconButton>
                            </Tooltip>
                        </li>

                        <li>
                        <Link to="/my-list">
                        <Tooltip title="Item disukai">
                            <IconButton aria-label="cart">
                                <StyledBadge badgeContent={4} color="secondary">
                                    <FaRegHeart className="text-white" />
                                </StyledBadge>
                            </IconButton>
                        </Tooltip>
                        </Link>
                        </li>
                        </div>
                        
                            <Button className="myAccountWrap flex items-center justify-center gap-1" onClick={handleClick}>
                                <div className="info flex flex-col text-right justify-start">
                                    <h4 className="text-[14px] text-[#f1f1f1] capitalize leading-3">{user?.name || 'Guest'}</h4>
                                </div>

                                <img className="!h-[40px] !w-[40px] !min-w-[40px] !rounded-full" src="/logo1.png" />
                            </Button>

                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                slotProps={{
                                paper: {
                                    elevation: 0,
                                    sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&::before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                    },
                                },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >

                                <Link to="/">
                                <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <IoHomeOutline className="text-[20px] text-black" />
                                </ListItemIcon>
                                Beranda
                                </MenuItem>
                                </Link>

                                <Link to="/dashboard">
                                <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <VscAccount className="text-[20px] text-black" />
                                </ListItemIcon>
                                Dashboard Akun
                                </MenuItem>
                                </Link>

                                <Link to="/my-orders">
                                <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <CiBoxList className="text-[20px] text-black" />
                                </ListItemIcon>
                                Status Orderan
                                </MenuItem>
                                </Link>

                                <Link to="/my-list">
                                <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <FaRegHeart className="text-[20px] text-black" />
                                </ListItemIcon>
                                Wishlist
                                </MenuItem>
                                </Link>

                                <Link to="/login">
                                <Divider />
                                <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <IoIosLogOut className="text-[20px] text-black" />
                                </ListItemIcon>
                                Keluar dari Akun
                                </MenuItem>
                                </Link>
                            </Menu>

                            </>
                        )
                    }
                    </ul>
                </div>
            </div>
        </div>

        <Navigation />

    </header>
  )
}

export default Header;