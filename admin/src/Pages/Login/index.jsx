// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Divider
} from '@mui/material';
import { IoLogInOutline } from 'react-icons/io5';
import { AuthContext } from '../../Components/Auth/AuthContext';

export default function Login() {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base) console.error('⚠️ VITE_API_BASE_URL belum diset di file .env');

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Email dan password wajib diisi');
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch(`${base}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        // Munculkan pesan kesalahan dari server jika tersedia
        throw new Error(json?.message || `HTTP ${res.status}`);
      }

      localStorage.setItem('token', json.token);
      localStorage.setItem('user', JSON.stringify(json.user)); // simpan user (optional)
      setUser(json.user);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message ?? 'Login gagal, coba lagi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#fafafa',
        px: 2
      }}>
      <Card
        sx={{
          width: '100%',
          maxWidth: 480,
          borderRadius: 2,
          boxShadow: 6
        }}>
        <CardContent sx={{ px: 4, py: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Link to="/" style={{ display: 'block', marginBottom: 14 }}>
              <img
                src="/logo.png"
                alt="Logo"
                style={{ width: 180, display: 'inline-block' }}
              />
            </Link>
            <Typography variant="h5" component="h1" fontWeight="600" sx={{ letterSpacing: 0.5 }}>
              Masuk ke Modifikasi ORI
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }} align="center">
                {error}
              </Typography>
            )}

            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              required
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={submitting}
              sx={{
                mt: 4,
                py: 1.5,
                backgroundColor: '#D32F2F',
                color: '#FFFFFF',
                fontWeight: '600',
                letterSpacing: 1,
                textTransform: 'uppercase',
                borderRadius: 2,
                boxShadow: 3,
                '&:hover': {
                  backgroundColor: '#B71C1C',
                  boxShadow: 6
                }
              }}>
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <IoLogInOutline fontSize={20} />
                  Masuk
                </Box>
              )}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2">
              Belum punya akun?{' '}
              <NavLink
                to="/register"
                style={{
                  color: '#D32F2F',
                  fontWeight: 500,
                  textDecoration: 'none'
                }}>
                Daftar
              </NavLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
