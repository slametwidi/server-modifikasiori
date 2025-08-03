import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './Pages/Home'
import ProductListing from './Pages/ProductListing'
import ProductDetails from './Pages/ProductDetails'
import Login from './Pages/Login'

import Button from '@mui/material/Button';
import { createContext, useState } from 'react'
import CartPage from './Pages/Cart'
import MyAccount from './Pages/Myaccount'
import MyList from './Pages/MyList'
import Orders from './Pages/Orders'
import ProtectedRoute from './components/ProtectedRoute'
import { CartProvider } from './components/CartContext';
import { NotificationProvider } from './components/NotificationContext';
import Dashboard from './Pages/Dashboard'
import Tagihan from './Pages/Tagihan'
import InvoiceDashboard from './Pages/InvoiceDashboard'
import { AuthProvider } from './components/Auth/AuthContext';



const MyContext = createContext();

function App() {

  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin") === "true");

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  const contextValues = {
    setOpenCartPanel,
    toggleCartPanel,
    openCartPanel,
    isLogin,
    setIsLogin
  };
  

  return (
    <> 
    <AuthProvider>
    <CartProvider>
    <NotificationProvider>
      <BrowserRouter>
      <MyContext.Provider value={contextValues}>
        <Header/>
        <Routes>
          <Route path={"/"} exact={true} element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path={"/ProductListing"} exact={true} element={<ProtectedRoute><ProductListing/></ProtectedRoute>} />
          <Route path={"/product/:id"} element={<ProtectedRoute><ProductDetails/></ProtectedRoute>} />
          <Route path={"/login"} exact={true} element={<Login/>} />
          <Route path={"/cart"} exact={true} element={<ProtectedRoute><CartPage/></ProtectedRoute>} />
          <Route path={"/my-account"} exact={true} element={<ProtectedRoute><MyAccount/></ProtectedRoute>} />
          <Route path={"/my-list"} exact={true} element={<ProtectedRoute><MyList/></ProtectedRoute>} />
          <Route path={"/my-orders"} exact={true} element={<ProtectedRoute><Orders/></ProtectedRoute>} />
          <Route path={"/dashboard"} exact={true} element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path={"/tagihan"} exact={true} element={<ProtectedRoute><InvoiceDashboard/></ProtectedRoute>} />
        </Routes>
        <Footer/>
        </MyContext.Provider>
      </BrowserRouter>
      </NotificationProvider>
      </CartProvider>
    </AuthProvider>
      
    </>
  )
}

export default App;

export {MyContext}
