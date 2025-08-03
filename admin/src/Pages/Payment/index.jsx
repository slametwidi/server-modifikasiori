// src/components/AdminPayment.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, ButtonGroup, Button, Typography, Table, TableBody,
  TableCell, TableHead, TableRow, Card, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, InputAdornment
} from '@mui/material';

const statusLabels = {
  pending: 'Belum Ditagih',
  processing: 'Sedang Diproses',
  partial: 'Belum Lunas',
  paid: 'SEGERA CEK',
  done: 'Sudah Lunas'
};
const statusColors = {
  pending: 'error.main',
  processing: 'warning.main',
  partial: 'warning.dark',
  paid: 'info.main',
  done: 'success.main'
};

export default function AdminPayment() {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base) console.error('⚠️ VITE_API_BASE_URL tidak ditemukan');

  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [paidInput, setPaidInput] = useState(0);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => { fetchInvoices(); }, [base]);
  async function fetchInvoices() {
    setLoading(true);
    try {
      const res = await fetch(`${base}/api/invoices`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const js = await res.json();
      setInvoices(js);
      if (js.length > 0) setSelected(js[0]);
    } catch (err) {
      console.error('Tidak bisa memuat invoice:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selected && Array.isArray(selected.proofFileUrls)) {
      const arr = selected.proofFileUrls.map(str =>
        `${base}/uploads/${encodeURIComponent(str)}`
      );
      setPreviewUrls(arr);
    } else {
      setPreviewUrls([]);
    }
  }, [selected, base]);

  const filtered = invoices.filter(inv =>
    !filterStatus || inv.status === filterStatus
  );

  const handleStatus = status => {
    setFilterStatus(status);
    const ok = filtered.some(inv => inv === selected);
    if (!ok) setSelected(null);
  };

  const due = selected
    ? Math.max(0, (selected.totalAmount || 0) - (selected.paidAmount || 0))
    : 0;

  const canProcess = selected && ['partial', 'paid'].includes(selected.status);
  const canCharge = selected && selected.status === 'pending';

  async function handleProcess() {
    if (!selected) return alert('Pilih invoice dulu!');
    setVerifying(true);
    try {
      const res = await fetch(`${base}/api/invoices/${selected._id}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ paidAmount: paidInput })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || res.statusText);
      setInvoices(prev => prev.map(inv => inv._id === data._id ? data : inv));
      setSelected(data);
      setShowDialog(false);
    } catch (err) {
      alert(err.message || 'Proses gagal');
    } finally {
      setVerifying(false);
    }
  }

  async function handleTagih() {
    if (!canCharge) return;
    try {
      const res = await fetch(`${base}/api/invoices/${selected._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'processing' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInvoices(prev => prev.map(inv => inv._id === data._id ? data : inv));
      setSelected(data);
    } catch (err) {
      alert(err.message || 'Gagal mengubah status');
    }
  }

  return (
    <Box sx={{ display:'flex', height: '100vh', backgroundColor:'#f5f5f5' }}>
      <Box sx={{ width:'35%', p:2, borderRight:1, background:'white' }}>
        <ButtonGroup size="small" variant="contained" sx={{ mb:2 }}>
          <Button color={filterStatus===null ? 'primary':'inherit'} onClick={()=>handleStatus(null)}>All</Button>
          <Button color={filterStatus==='pending' ? 'primary':'inherit'} onClick={()=>handleStatus('pending')}>Belum Bayar</Button>
          <Button color={filterStatus==='partial' ? 'primary':'inherit'} onClick={()=>handleStatus('partial')}>Partial</Button>
          <Button color={filterStatus==='paid' ? 'primary':'inherit'} onClick={()=>handleStatus('paid')}>Lunas</Button>
        </ButtonGroup>
        <Table size="small">
          <TableBody>
            {loading ? (
              <TableRow><TableCell><Typography>Loading…</Typography></TableCell></TableRow>
            ) : (
              filtered.map(inv => (
                <TableRow
                  key={inv._id}
                  hover
                  selected={selected && selected._id === inv._id}
                  onClick={() => setSelected(inv)}
                  sx={{ cursor:'pointer' }}
                >
                  <TableCell>
                    <Typography variant="subtitle2">{inv.user?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {inv.invoiceId} • {inv.generatedAt && new Date(inv.generatedAt).toLocaleDateString('id-ID')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>Rp {inv.totalAmount?.toLocaleString('id-ID')}</Typography>
                    <Typography color={statusColors[inv.status]} variant="body2">
                      {statusLabels[inv.status]?.toUpperCase()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ width:'65%', p:4, background:'white', overflow:'auto' }}>
        {selected ? (
          <>
            <Box sx={{ display:'flex', justifyContent:'space-between', mb:3 }}>
              <Typography variant="h4">Invoice: {selected.invoiceId}</Typography>
              <Box>
                <Button variant="contained" disabled={!canProcess || verifying} onClick={()=>setShowDialog(true)}>
                  Proses
                </Button>
                <Button variant="contained" color="success" disabled={!canCharge} onClick={handleTagih} sx={{ ml:1 }}>
                  Tagih
                </Button>
              </Box>
            </Box>

            <Typography sx={{ mb:1 }}>
              <strong>Status:</strong> <span style={{ color: statusColors[selected.status] }}>
                {statusLabels[selected.status]}
              </span>
            </Typography>

            {(selected.status === 'partial' || selected.status==='pending') && (
              <Typography sx={{ color:'warning.main', mb:2 }}>
                Sisa: Rp {due.toLocaleString('id-ID')}
              </Typography>
            )}

            <Card variant="outlined" sx={{ p:3, mb:3 }}>
              <Box sx={{ display:'flex', justifyContent:'space-between' }}>
                <div>
                  <Typography variant="body2">Invoice Number</Typography>
                  <Typography variant="h6">{selected.invoiceId}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tgl Tagihan: {selected.generatedAt && new Date(selected.generatedAt).toLocaleDateString('id-ID')}
                  </Typography>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Typography variant="body2">Total:</Typography>
                  <Typography variant="h6">Rp {selected.totalAmount?.toLocaleString('id-ID')}</Typography>
                  <Typography variant="body2">Dibayar: Rp {(selected.paidAmount||0).toLocaleString('id-ID')}</Typography>
                  <Typography variant="body2">Sisa: Rp {due.toLocaleString('id-ID')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Jatuh Tempo: {selected.dueDate && new Date(selected.dueDate).toLocaleDateString('id-ID')}
                  </Typography>
                </div>
              </Box>
            </Card>

            {previewUrls.length > 0 && (
              <Card variant="outlined" sx={{ p:2, mb:3 }}>
                <Typography variant="subtitle2" mb={1}>Bukti Transfer:</Typography>
                <Box sx={{ display:'flex', flexWrap:'wrap', gap:2 }}>
                  {previewUrls.map((src,i) => (
                    <Box
                      key={i}
                      component="img"
                      src={src}
                      alt={`Bukti ${i+1}`}
                      onError={e => e.currentTarget.src = '/fallback.png'}
                      sx={{
                        width: 120, height: 80,
                        objectFit:'cover',
                        cursor:'pointer',
                        border: '1px solid #ccc',
                        borderRadius: 1
                      }}
                      onClick={()=> window.open(src, '_blank')}
                    />
                  ))}
                </Box>
              </Card>
            )}

            {/* Tabel detail order */}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>ID Pesanan</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selected.orderIds.map((o, idx) => (
                  <React.Fragment key={o._id}>
                    <TableRow>
                      <TableCell rowSpan={o.items.length}>{idx+1}</TableCell>
                      <TableCell rowSpan={o.items.length}>{o._id.slice(-6)}</TableCell>
                      <TableCell align="right">Rp {(o.items[0].qty * o.items[0].price)?.toLocaleString('id-ID')}</TableCell>
                    </TableRow>
                    {o.items.slice(1).map((it,j) => (
                      <TableRow key={j}>
                        <TableCell align="right">Rp {(it.qty * it.price)?.toLocaleString('id-ID')}</TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <Typography variant="h6">Pilih invoice terlebih dahulu.</Typography>
        )}
      </Box>

      {/* Dialog validasi pembayaran */}
      <Dialog open={showDialog} onClose={()=>setShowDialog(false)}>
        <DialogTitle>Validasi Pembayaran</DialogTitle>
        <DialogContent>
          <Typography>Total: Rp {(selected?.totalAmount||0).toLocaleString('id-ID')}</Typography>
          <Typography>Dibayar: Rp {(selected?.paidAmount||0).toLocaleString('id-ID')}</Typography>
          <Typography sx={{ fontWeight:'bold', mb:1 }}>
            Sisa: Rp {due.toLocaleString('id-ID')}
          </Typography>
          <TextField
            label="Jumlah Dibayar"
            type="number"
            fullWidth
            value={paidInput}
            InputProps={{
              readOnly: selected?.status === 'partial',
              startAdornment: <InputAdornment position="start">Rp</InputAdornment>
            }}
            onChange={e => setPaidInput(Number(e.target.value))}
            margin="dense"
          />
          <Typography>Kurang: Rp {Math.max(0, due - paidInput).toLocaleString('id-ID')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setShowDialog(false)}>Batal</Button>
          <Button variant="contained" disabled={verifying || !(paidInput >= 0)} onClick={handleProcess}>
            {verifying ? 'Menyimpan...' : 'Proses'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
