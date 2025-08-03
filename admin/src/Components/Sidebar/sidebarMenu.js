// src/components/Sidebar/sidebarMenu.js
export const menuItems = [
  { key: 'dashboard', label: 'Dashboard', to: '/', roles: ['admin','user','accounting'] },

  { key: 'orders', label: 'Data Pesanan', to: '/orders', roles: ['admin','user'] },

  { key: 'pembayaran', label: 'Data Pembayaran', to: '/payment', roles: ['admin','user','accounting'] },

  {
    key: 'products',
    label: 'Products',
    roles: ['admin'],
    sub: [
      { key: 'productsList', label: 'Data Produk', to: '/productslist' },
      { key: 'productsAdd', label: 'Tambah Produk via Modal', action: 'openModal' }
    ]
  },

  { key: 'dpaccounting', label: 'Data Pesanan', to: '/orders', roles: ['accounting'] },
 
  {
    key: 'kategori',
    label: 'Kategori',
    roles: ['admin'],
    sub: [
      { key: 'categoryList', label: 'List Kategori Produk', to: '/categorylist' },
      { key: 'categoryAdd', label: 'Tambah Kategori Produk', to: '/addcategory' }
    ]
  },
  
  { key: 'users', label: 'Users', to: '/users', roles: ['admin'] }
];
