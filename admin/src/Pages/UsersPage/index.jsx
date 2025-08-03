// src/pages/UsersPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Button, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Box
} from '@mui/material';

export default function UsersPage() {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base) console.warn('VITE_API_BASE_URL belum diset di .env');

  const token = localStorage.getItem('token') || '';
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${base}/api/admin/users`, { headers });
        if (!res.ok) throw new Error(`Fetch users gagal — HTTP ${res.status}`);
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [base]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch(`${base}/api/admin/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || `HTTP ${res.status}`);
      }
      const newUser = await res.json();
      setUsers(prev => [...prev, newUser]);
      setDialogOpen(false);
      setForm({ name: '', email: '', password: '', role: '' });
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(_id, currentActive) {
    try {
      const res = await fetch(`${base}/api/admin/users/${_id}/toggle`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ active: !currentActive })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      setUsers(prev => prev.map(u => (u._id === _id ? updated : u)));
    } catch (err) {
      console.error(err);
      alert('Gagal update status: ' + err.message);
    }
  }

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        sx={{ m: 2 }}
        onClick={() => setDialogOpen(true)}
      >
        Tambah Pengguna
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={() => !submitting && setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Buat Akun Baru</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Nama"
            fullWidth
            margin="dense"
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextField
            name="email"
            label="Email"
            fullWidth
            margin="dense"
            value={form.email}
            onChange={handleChange}
            type="email"
            required
          />
          <TextField
            name="password"
            label="Password"
            fullWidth
            margin="dense"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              label="Role"
              value={form.role}
              onChange={handleChange}
              required
            >
              {['management', 'accounting', 'admingudang', 'reseller'].map(r => (
                <MenuItem key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => dialogOpen && !submitting && setDialogOpen(false)}
            disabled={submitting}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Menyimpan…' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u._id}>
                <TableCell>{u._id.slice(-6)}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.active ? 'Aktif' : 'Non‑aktif'}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => toggleActive(u._id, u.active)}
                  >
                    {u.active ? 'Non‑aktifkan' : 'Aktifkan'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
