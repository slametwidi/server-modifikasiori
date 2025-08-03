import './App.css'
import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Dashboard from './Pages/Dashboard';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import { createContext, useState } from 'react';
import Login from './Pages/Login';
import Products from './Pages/Products';
import { Navigate } from 'react-router-dom';
import { AuthProvider } from './Components/Auth/AuthContext';

import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IoMdClose } from "react-icons/io";
import Slide from '@mui/material/Slide';
import { Button } from '@mui/material';
import AddProduct from './Pages/Products/addProduct';
import HomeSliderBanners from './Pages/HomeSliderBanners';
import AddHomeBanner from './Pages/HomeSliderBanners/addHomeBanner';
import AddCategory from './Pages/Category/addCategory';
import CategoryList from './Pages/Category';
import AddMotor from './Pages/Motor/addMotor';
import MotorList from './Pages/Motor';
import MerkProdukList from './Pages/MerkProduk';
import AdminOrders from './Pages/Orders';
import UsersPage from './Pages/UsersPage';
import AdminPayment from './Pages/Payment';
import CategoryEdit from './Pages/Category/CategoryEdit';

const Transition = React.forwardRef(function Transition(props, ref) {
    
  return <Slide direction="up" ref={ref} {...props} />;
});

function App() {
  const [isLogin, setIsLogin] = useState(false);

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user')) || null;
  });

  const [isOpenFullScreenPanel, setIsOpenFullScreenPanel] = useState({
    open:false,
    model:''
  });

function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // tidak ada pengecekan role—pengguna yang login, baik admin maupun user, bisa lanjut
  return children;
}

  const router = createBrowserRouter([
    {
      path:"/",
      exact:true,
      element:(
        <PrivateRoute>
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className='sidebarWrapper w-[18%]'>
                <Sidebar />
              </div>

              <div className='contentRight py-4 px-4 w-[82%]'>
                <Dashboard />
              </div>
            </div>
          </section>
        </>
        </PrivateRoute>
      ),
    },

    {
      path:"/login",
      exact:true,
      element:(
        <>
          <Login />
        </>
      ),
    },

    {
      path:"/productslist",
      exact:true,
      element:(
        <PrivateRoute>
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className='sidebarWrapper w-[18%]'>
                <Sidebar />
              </div>

              <div className='contentRight py-4 px-4 w-[82%]'>
                <Products />
              </div>
            </div>
          </section>
        </>
        </PrivateRoute>
      ),
    },

    {
      path:"/orders",
      exact:true,
      element:(
        <PrivateRoute>
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className='sidebarWrapper w-[18%]'>
                <Sidebar />
              </div>

              <div className='contentRight py-4 px-4 w-[82%]'>
                <AdminOrders />
              </div>
            </div>
          </section>
        </>
        </PrivateRoute>
      ),
    },

    {
      path:"/payment",
      exact:true,
      element:(
        <PrivateRoute>
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className='sidebarWrapper w-[18%]'>
                <Sidebar />
              </div>

              <div className='contentRight py-4 px-4 w-[82%]'>
                <AdminPayment />
              </div>
            </div>
          </section>
        </>
        </PrivateRoute>
      ),
    },

    {
      path:"/homeSlider/list",
      exact:true,
      element:(
        <PrivateRoute>
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className='sidebarWrapper w-[18%]'>
                <Sidebar />
              </div>

              <div className='contentRight py-4 px-4 w-[82%]'>
                <HomeSliderBanners />
              </div>
            </div>
          </section>
        </>
        </PrivateRoute>
      ),
    },

    {
      path:"/categorylist",
      exact:true,
      element:(
        <PrivateRoute>
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className='sidebarWrapper w-[18%]'>
                <Sidebar />
              </div>

              <div className='contentRight py-4 px-4 w-[82%]'>
                <CategoryList />
              </div>
            </div>
          </section>
        </>
        </PrivateRoute>
      ),
    },

    {
      path:"/users",
      exact:true,
      element:(
        <PrivateRoute>
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className='sidebarWrapper w-[18%]'>
                <Sidebar />
              </div>

              <div className='contentRight py-4 px-4 w-[82%]'>
                <UsersPage />
              </div>
            </div>
          </section>
        </>
        </PrivateRoute>
      ),
    },

    {
      path:"/addsubcategory",
      exact:true,
      element:(
        <PrivateRoute>
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className='sidebarWrapper w-[18%]'>
                <Sidebar />
              </div>

              <div className='contentRight py-4 px-4 w-[82%]'>
                <AddMotor />
              </div>
            </div>
          </section>
        </>
        </PrivateRoute>
      ),
    },

    {
      path:"/addmerkproduk",
      exact:true,
      element:(
        <PrivateRoute>
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className='sidebarWrapper w-[18%]'>
                <Sidebar />
              </div>

              <div className='contentRight py-4 px-4 w-[82%]'>
                <AddMotor />
              </div>
            </div>
          </section>
        </>
        </PrivateRoute>
      ),
    },

    {
      path:"/merkproduk",
      exact:true,
      element:(
        <PrivateRoute>
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className='sidebarWrapper w-[18%]'>
                <Sidebar />
              </div>

              <div className='contentRight py-4 px-4 w-[82%]'>
                <MerkProdukList />
              </div>
            </div>
          </section>
        </>
        </PrivateRoute>
      ),
    },

    {
      path:"/subcategory",
      exact:true,
      element:(
        <PrivateRoute>
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className='sidebarWrapper w-[18%]'>
                <Sidebar />
              </div>

              <div className='contentRight py-4 px-4 w-[82%]'>
                <MotorList />
              </div>
            </div>
          </section>
        </>
        </PrivateRoute>
      ),
    },

    {
      path:"/homeSlider/add",
      exact:true,
      element:(
        <PrivateRoute>
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className='sidebarWrapper w-[18%]'>
                <Sidebar />
              </div>

              <div className='contentRight py-4 px-4 w-[82%]'>
                <AddHomeBanner />
              </div>
            </div>
          </section>
        </>
        </PrivateRoute>
      ),
    },

    {
      path:"/addcategory",
      exact:true,
      element:(
        <PrivateRoute>
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className='sidebarWrapper w-[18%]'>
                <Sidebar />
              </div>

              <div className='contentRight py-4 px-4 w-[82%]'>
                <AddCategory />
              </div>
            </div>
          </section>
        </>
        </PrivateRoute>
      ),
    },

    {
      path:"/product/upload",
      exact:true,
      element:(
        <PrivateRoute>
        <>
          <AddProduct />
        </>
        </PrivateRoute>
      ),
    },

    {
  path: "/categories/edit/:id",
  exact: true,
  element: (
    <PrivateRoute>
      <>
        <section className='main'>
          <Header />
          <div className='contentMain flex'>
            <div className='sidebarWrapper w-[18%]'>
              <Sidebar />
            </div>

            <div className='contentRight py-4 px-4 w-[82%]'>
              <CategoryEdit />
            </div>
          </div>
        </section>
      </>
    </PrivateRoute>
  ),
},
  ]);

  const values = {
    isLogin,
    setIsLogin,
    setIsOpenFullScreenPanel,
    user,
    setUser,
    isOpenFullScreenPanel
  }

  return (
    <>
    <AuthProvider>
    <MyContext.Provider value={values}>
    <RouterProvider router={router} />

    <Dialog
        fullScreen
        open={isOpenFullScreenPanel.open}
        onClose={()=>setIsOpenFullScreenPanel({open: false})}
        slots={{
          transition: Transition,
        }}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={()=>setIsOpenFullScreenPanel({open: false})}
              aria-label="close"
            >
              <IoMdClose className='text-gray-800' />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              <span className='text-gray-800'>{isOpenFullScreenPanel?.model}</span>
            </Typography>
          </Toolbar>
        </AppBar>
        {
          isOpenFullScreenPanel?.model === "Tambah Data Produk Baru" && <AddProduct/>
        }
      </Dialog>

    </MyContext.Provider>
    </AuthProvider>
    </>
  );
}

export default App
export const MyContext = createContext();