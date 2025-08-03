import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AccountSidebar from '../../components/AccountSidebar';
import ProgressToTarget from '../../components/ProgressToTarget';
import DashboardBoxes from '../../components/DashboardBoxes';
import DailyChart from '../../components/DailyChart';

const Dashboard = () => {
  const [dailyData, setDailyData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

const formatCurrency = v => {
  const num = Number(v) || 0;
  if (num >= 1_000_000) {
    const jt = Number.parseFloat((num / 1_000_000).toFixed(1));
    return `Rp ${jt} jt`;
  }
  if (num >= 1_000) {
    const rb = Number.parseFloat((num / 1_000).toFixed(0));
    return `Rp ${rb} rb`;
  }
  return `Rp ${num.toLocaleString('id-ID')}`;
};

  useEffect(() => {
    axios.get('/api/orders/my/summary', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      const rev = Number(res.data.totalRevenue) || 0;
      setTotalRevenue(rev);
    })
    .catch(err => console.error('Summary fetch error', err));

    axios.get('/api/orders/my/daily-summary', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setDailyData(res.data || []))
    .catch(err => console.error('Daily summary fetch error', err));
  }, []);

  return (
    <section className="py-10 px-6">
      <div className="flex gap-5">
        <div className="w-1/5"><AccountSidebar /></div>
        <main className="flex-1 p-6 pt-0 bg-[#f5f0f0] overflow-auto">
          <ProgressToTarget
            title="Progress Omset Bulanan"
            bannerTitle="Program Reseller"
            bannerImageUrl="../banner2.webp"
            bannerText="Promo gratis ongkir & upload minimal 1 produk setiap hari untuk dorong omset!"
            target={900_000_000}
            formatCurrency={formatCurrency}
          />
          <DashboardBoxes totalRevenue={totalRevenue} />
          <h2 className="text-lg font-semibold mt-6">
            Grafik Pesanan &amp; Omset Harian
          </h2>
          <DailyChart data={dailyData} formatCurrency={formatCurrency} />
        </main>
      </div>
    </section>
  );
};

export default Dashboard;
