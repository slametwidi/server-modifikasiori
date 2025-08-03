import { TextField } from '@mui/material';
import React, { useState, useContext } from 'react';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MyContext } from '../../App'; // Pastikan path ini sesuai

const Login = () => {
  const { setIsLogin } = useContext(MyContext); // ✅ Ambil dari context

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
  if (!base) console.warn('⚠️ VITE_API_BASE_URL belum didefinisikan di file .env');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${base}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login gagal');
        setLoading(false);
        return;
      }

      // ✅ Simpan token dan data user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isLogin', 'true'); // Optional

      // ✅ Update context login state
      setIsLogin(true);

      // ✅ Redirect ke halaman utama
      window.location.href = '/';
    } catch (err) {
      setError('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section py-14 mb-[40px]">
      <div className="container">
        <div className="card shadow-md w-[500px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[18px] font-[500] text-black">
            Masuk ke Akun Kamu
          </h3>

          <form className="w-full mt-5" onSubmit={handleLogin}>
            <div className="form-group w-full mb-5">
              <TextField
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                label="Akun User ID"
                variant="outlined"
                className="w-full"
              />
            </div>

            <div className="form-group w-full mb-5 relative">
              <TextField
                onChange={(e) => setPassword(e.target.value)}
                type={isPasswordShow ? 'text' : 'password'}
                id="password"
                label="Password"
                variant="outlined"
                className="w-full"
              />
              <button
                type="button"
                className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black"
                onClick={() => setIsPasswordShow(!isPasswordShow)}
              >
                {isPasswordShow ? (
                  <IoMdEye className="text-[20px] opacity-75" />
                ) : (
                  <IoMdEyeOff className="text-[20px] opacity-75" />
                )}
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-center mb-3">{error}</div>
            )}

            <div className="flex items-center w-full mt-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-org w-full btn-lg !rounded-full !bg-[#ff0000] !text-white hover:!bg-black hover:!text-white !transition-colors !duration-500 !ease-in-out"
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
