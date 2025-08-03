import React, { useState, useEffect, useContext } from 'react'
import { Button } from '@mui/material'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import AccountSidebar from '../../components/AccountSidebar'
import { AuthContext } from '../../components/Auth/AuthContext';


// Custom debounce hook
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

const Orders = () => {
  const { user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [openIndex, setOpenIndex] = useState(null)

  const [filterOrderStatus, setFilterOrderStatus] = useState('')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)

  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '')
  if (!base) console.warn('⚠️ VITE_API_BASE_URL belum diset di .env')

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`${base}/api/orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        const data = await res.json()
        const sorted = data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setOrders(sorted)
      } catch (e) {
        console.error('Fetch error', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="text-center py-10">Loading…</div>

  const userOrders = orders.filter(o => o.user?.email === user.email)

  const filtered = userOrders
    .filter(o => {
      if (filterOrderStatus) {
        if (filterOrderStatus === 'done' && o.status !== 'done') return false
        if (filterOrderStatus === 'pending' && o.status !== 'pending') return false
      }
      if (filterPaymentStatus) {
        const paid = !!o.paymentStatus
        if (filterPaymentStatus === 'paid' && !paid) return false
        if (filterPaymentStatus === 'unpaid' && paid) return false
      }
      if (filterFrom) {
        const d = new Date(o.createdAt).setHours(0, 0, 0, 0)
        if (d < new Date(filterFrom).getTime()) return false
      }
      if (filterTo) {
        const d = new Date(o.createdAt).setHours(0, 0, 0, 0)
        if (d > new Date(filterTo).getTime()) return false
      }
      return true
    })
    .filter(o => {
      if (!debouncedSearch) return true
      return o._id.toLowerCase().includes(debouncedSearch.toLowerCase())
    })

  const formatDate = d => new Date(d).toLocaleDateString('id-ID')

  return (
    <section className="py-10 px-6">
      <div className="flex gap-5">
        <div className="w-1/5"><AccountSidebar /></div>
        <div className="w-4/5 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg">Data Pesanan Anda</h2>
              <p className="mt-1">Anda memiliki <span className="font-semibold">{filtered.length}</span> pesanan</p>
            </div>
            <div className="flex gap-3 items-center">
              <input type="text" placeholder="Cari ID Pesanan…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm" />
              <select value={filterOrderStatus} onChange={e => setFilterOrderStatus(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option value="">Semua Status Pesanan</option>
                <option value="done">Selesai</option>
                <option value="pending">Menunggu</option>
              </select>
              <select value={filterPaymentStatus} onChange={e => setFilterPaymentStatus(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option value="">Semua Status Pembayaran</option>
                <option value="paid">Lunas</option>
                <option value="unpaid">Belum Lunas</option>
              </select>
              <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm" />
              <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-600">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-center">Detail</th>
                  <th className="px-4 py-3 text-center">ID</th>
                  <th className="px-4 py-3 text-center">Status Pesanan</th>
                  <th className="px-4 py-3 text-center">Status Pembayaran</th>
                  <th className="px-4 py-3 text-center">Item</th>
                  <th className="px-4 py-3 text-center">Total Harga</th>
                  <th className="px-4 py-3 text-center">Tanggal</th>
                  <th className="px-4 py-3 text-center">Resi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-500">Tidak ada pesanan</td>
                  </tr>
                )}
                {filtered.map((order, i) => {
                  const orderLabel = order.status === 'done' ? 'Selesai' : 'Menunggu'
                  const payLabel = order.paymentStatus ? 'Lunas' : 'Belum Lunas'
                  return (
                    <React.Fragment key={order._id}>
                      <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                        <td className="px-4 py-3 text-center">
                          <Button className="p-2 bg-gray-100 rounded-full" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                            {openIndex === i ? <FaChevronUp /> : <FaChevronDown />}
                          </Button>
                        </td>
                        <td className="px-4 py-3 text-center font-semibold">{order._id.slice(-6)}</td>
                        <td className="px-4 py-3 text-center"><span className={`px-2 py-1 text-xs font-medium rounded ${orderLabel === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{orderLabel}</span></td>
                        <td className="px-4 py-3 text-center"><span className={`px-2 py-1 text-xs font-medium rounded ${order.paymentStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{payLabel}</span></td>
                        <td className="px-4 py-3 text-center">{order.items?.length ?? 0}</td>
                        <td className="px-4 py-3 text-center font-mono">Rp. {(order.totalPrice ?? 0).toLocaleString('id-ID')}</td>
                        <td className="px-4 py-3 text-center">{formatDate(order.createdAt)}</td>
                        <td className="px-4 py-3 text-center">
                          {order.resiFile ? (
                            <Button variant="outlined" size="small" onClick={() => window.open(`${base}/uploads/${order.resiFile}`, '_blank', 'noopener,noreferrer')}>
                              Lihat Resi
                            </Button>
                          ) : '-'}
                        </td>
                      </tr>
                      {openIndex === i && (
                        <tr>
                          <td colSpan="8" className="pl-10 pr-4 py-2 bg-gray-100">
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm text-gray-600">
                                <thead className="bg-gray-200">
                                  <tr>
                                    <th className="px-3 py-2 text-center">No</th><th className="px-3 py-2 text-center">Produk</th><th className="px-3 py-2 text-center">Type Motor</th><th className="px-3 py-2 text-center">Varian</th><th className="px-3 py-2 text-center">Qty</th><th className="px-3 py-2 text-center">Harga</th><th className="px-3 py-2 text-center">Total</th><th className="px-3 py-2 text-center">Catatan</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items?.map((it, j) => {
                                    const pr = it.price ?? 0, qty = it.qty ?? 0, tot = pr * qty
                                    return (
                                      <tr key={j} className="bg-white even:bg-gray-50">
                                        <td className="px-3 py-2 text-center">{j + 1}</td>
                                        <td className="px-3 py-2 text-center">{it.product?.name || '-'}</td>
                                        <td className="px-3 py-2 text-center">{it.merkLabel || '-'}</td>
                                        <td className="px-3 py-2 text-center">{it.variantLabel || '-'}</td>
                                        <td className="px-3 py-2 text-center">{qty}</td>
                                        <td className="px-3 py-2 text-center">Rp. {pr.toLocaleString('id-ID')}</td>
                                        <td className="px-3 py-2 text-center">Rp. {tot.toLocaleString('id-ID')}</td>
                                        <td className="px-3 py-2 text-center">{it.note || '-'}</td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Orders
