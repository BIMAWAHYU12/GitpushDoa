import React, { useState, useEffect, useRef } from 'react';

const Dashboard = () => {
  // State untuk data agregat statistik
  const [stats, setStats] = useState({
    total_barang: 0,
    total_kategori: 0,
    total_transaksi: 0,
    total_outlet: 0,
    total_supplier: 0,
  });
  
  // State untuk data barang (untuk grafik & katalog)
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState('');

  // 🔥 STATE BARU: Untuk Manajemen Notifikasi Dinamis
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const adminName = localStorage.getItem('username') || 'Admin';

  // Handler Klik di luar dropdown untuk nutup otomatis
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const opsi = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('id-ID', opsi));

    const initDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const resStats = await fetch('http://localhost:5000/api/dashboard', { method: 'GET', headers });
        const resultStats = await resStats.json();
        if (!resStats.ok) throw new Error(resultStats.message || 'Gagal sinkronisasi data statistik');

        const resProducts = await fetch('http://localhost:5000/api/barang', { method: 'GET', headers });
        const resultProducts = await resProducts.json();

        setStats(resultStats.data);
        
        const productsData = Array.isArray(resultProducts) ? resultProducts : resultProducts.data || [];
        setAllProducts(productsData);

        // 🔥 GENERATE NOTIFIKASI SECARA DINAMIS BERDASARKAN KONDISI DATA DB
        const listNotif = [];
        
        // 1. Cek Barang yang Hampir Habis (Stok < 5)
        const lowStockItems = productsData.filter(item => parseInt(item.stok) < 5);
        lowStockItems.forEach(item => {
          listNotif.push({
            id: `low-${item.id_barang}`,
            tipe: 'warning',
            icon: 'fa-triangle-exclamation',
            text: `Stok Kritis! ${item.nama} tersisa ${item.stok} unit di RAK: ${item.nama_rak || item.rak_id}.`,
            time: 'Baru Saja'
          });
        });

        // 2. Cek Total Log Transaksi Terkini
        if (resultStats.data.total_transaksi > 0) {
          listNotif.push({
            id: 'trans-info',
            tipe: 'info',
            icon: 'fa-circle-info',
            text: `Sistem mencatat total ${resultStats.data.total_transaksi} log mutasi aktif aman tersimpan.`,
            time: 'Hari Ini'
          });
        }

        setNotifications(listNotif);

      } catch (err) {
        console.error("[DASHBOARD INITIALIZATION ERROR]:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initDashboard();
  }, []);

  // ================= LOGIKA GRAFIK & KONDISI GUDANG =================
  const topStokProducts = [...allProducts]
    .sort((a, b) => parseInt(b.stok) - parseInt(a.stok))
    .slice(0, 5);

  const maxStok = topStokProducts.length > 0 
    ? Math.max(...topStokProducts.map(p => parseInt(p.stok))) 
    : 1;

  const itemsLowStock = allProducts.filter(item => parseInt(item.stok) < 5).length;
  const totalItemCount = allProducts.length;
  const safeStockPercentage = totalItemCount > 0 
    ? Math.round(((totalItemCount - itemsLowStock) / totalItemCount) * 100) 
    : 100;
  
  const strokeDashoffset = 251 - (251 * safeStockPercentage) / 100;
  const latestProductsForCatalog = allProducts.slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans gap-3">
        <div className="w-12 h-12 border-[3.5px] border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 animate-pulse">Loading Matrix...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50/50 border border-red-100 rounded-[32px] text-center max-w-lg mx-auto mt-20 font-sans backdrop-blur-sm">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-4 font-bold text-lg">⚠️</div>
        <h3 className="font-black text-slate-800 uppercase text-xs tracking-wider mb-1">Koneksi Terputus</h3>
        <p className="text-slate-500 text-xs mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-slate-900 text-white font-black text-[10px] tracking-widest rounded-xl uppercase hover:bg-slate-800 transition-all">Coba Lagi</button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-10 max-w-[1400px] mx-auto font-sans px-2">
      
      {/* 🗓️ HEADER SECTION */}
      <div className="flex items-center justify-between px-1 relative z-30">
        <div>
          <h4 className="text-[10px] md:text-xs font-black text-emerald-600 uppercase tracking-[0.3em] mb-1">Status Sistem: Online</h4>
          <div className="flex items-center gap-2 text-slate-400">
            <i className="fas fa-calendar-day text-xs"></i>
            <span className="text-[11px] font-bold uppercase">{currentDate}</span>
          </div>
        </div>

        {/* 🔔 LOGO NOTIFIKASI AKTIF (Dinamis & Dropdown Popover) */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center relative shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
          >
            <i className="fas fa-bell text-slate-400"></i>
            {/* Hanya tampilkan lingkaran merah jika ada notifikasi aktif */}
            {notifications.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                {notifications.length}
              </span>
            )}
          </button>

          {/* DROPDOWN CONTAINER POPOVER */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl border border-slate-100 shadow-xl py-4 z-[999] animate-fadeIn max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="px-5 pb-3 border-b border-slate-50 flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-800 tracking-wider uppercase">Pemberitahuan Sistem ({notifications.length})</h4>
                {notifications.length > 0 && (
                  <button onClick={() => setNotifications([])} className="text-[9px] font-bold text-red-500 uppercase hover:underline">Bersihkan</button>
                )}
              </div>
              
              <div className="divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs font-medium">
                    <i className="fas fa-bell-slash text-slate-200 text-xl mb-2 block"></i>
                    Gudang dalam kondisi aman ter kendali.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-4 flex gap-3 hover:bg-slate-50/60 transition-colors text-left">
                      <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs ${n.tipe === 'warning' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                        <i className={`fas ${n.icon}`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-700 leading-tight mb-1">{n.text}</p>
                        <span className="text-[9px] font-medium text-slate-400">{n.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🚀 HERO SECTION */}
      <div className="bg-gradient-to-r from-[#0D9488] to-[#1E40AF] rounded-3xl p-6 md:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl md:text-4xl font-black tracking-tight leading-none uppercase mb-2">Selamat Datang, {adminName}</h2>
          <p className="text-white/70 text-[10px] md:text-base font-medium max-w-md">Kelola mutasi stok barang elektronik dengan presisi real time.</p>
        </div>
        <i className="fas fa-box-open absolute -bottom-6 -right-6 text-8xl text-white/10 -rotate-12"></i>
      </div>

      {/* 📊 SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard label="DATA BARANG" value={stats.total_barang} sub="SKU" icon="fa-barcode" color="text-emerald-600" />
        <StatCard label="STOK FISIK" value={allProducts.reduce((acc, curr) => acc + parseInt(curr.stok), 0)} sub="Unit" icon="fa-box" color="text-blue-600" />
        <StatCard label="RE-ORDER" value={itemsLowStock} sub="Item" icon="fa-clock-rotate-left" color="text-teal-600" />
        <StatCard label="TOTAL TRANSAKSI" value={stats.total_transaksi} sub="Log" icon="fa-list-check" color="text-slate-800" />
      </div>

      {/* 📈 ANALITIK & STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
              <i className="fas fa-chart-line text-xs"></i>
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Analitik Top 5 Stok Terbanyak</h3>
          </div>
          
          {topStokProducts.length === 0 ? (
            <div className="h-44 md:h-64 flex items-center justify-center text-slate-400 text-xs font-bold border border-dashed border-slate-100 rounded-xl">Belum ada data barang.</div>
          ) : (
            <div className="h-44 md:h-64 flex items-end justify-between px-2 gap-3 md:gap-6 border-b border-slate-50 pb-2">
              {topStokProducts.map((item, index) => {
                const stokVal = parseInt(item.stok);
                const barHeight = maxStok > 0 ? `${(stokVal / maxStok) * 100}%` : '0%';
                return (
                  <Bar 
                    key={item.id_barang || index}
                    height={barHeight} 
                    label={item.nama} 
                    value={`${stokVal} U`}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* KESEHATAN GUDANG */}
        <div className="bg-white rounded-3xl p-5 md:p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
           <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
             <i className="fas fa-heart-pulse text-blue-500"></i> Kondisi Gudang
           </h3>
           <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                    <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="251" strokeDashoffset={strokeDashoffset} className="text-emerald-500 transition-all duration-1000" strokeLinecap="round" />
                 </svg>
                 <p className="absolute text-xl md:text-3xl font-black text-slate-800">{safeStockPercentage}%</p>
              </div>
              <div className="w-full mt-6 space-y-2">
                 <HealthItem label="AMAN" val={`${totalItemCount - itemsLowStock} SKU`} color="bg-emerald-500" bg="bg-emerald-50" />
                 <HealthItem label="RE-ORDER" val={`${itemsLowStock} SKU`} color="bg-blue-500" bg="bg-blue-50" />
              </div>
           </div>
        </div>
      </div>

      {/* 📦 KATALOG LIVE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-slate-800 uppercase tracking-[0.2em] text-xs">Update Katalog Live</h3>
          <div className="text-[9px] font-bold text-slate-400 uppercase italic">Real-time Data</div>
        </div>

        {latestProductsForCatalog.length === 0 ? (
           <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs font-bold">Belum ada barang di database.</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
             {latestProductsForCatalog.map((item, index) => (
               <ProductCard 
                 key={item.id_barang || index}
                 name={item.nama} 
                 cat={item.nama_kategori || `Cat: ${item.kategori_id}`} 
                 stock={item.stok} 
                 rack={item.nama_rak || item.rak_id} 
                 imageName={item.gambar}
                 isLow={parseInt(item.stok) < 5} 
               />
             ))}
          </div>
        )}
      </div>

    </div>
  );
};

// --- SUB-COMPONENTS (Sama Seperti Sebelumnya) ---
const StatCard = ({ label, value, sub, icon, color }) => (
  <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
    <div className="flex justify-between items-start mb-3 md:mb-5">
      <p className="text-[8px] md:text-[10px] font-black text-slate-400 tracking-widest uppercase">{label}</p>
      <i className={`fas ${icon} text-slate-100 text-sm md:text-xl group-hover:text-emerald-500/10 transition-colors`}></i>
    </div>
    <div className="flex items-baseline gap-1">
      <h3 className={`text-xl md:text-4xl font-black ${color} tracking-tighter`}>{value}</h3>
      <span className="text-[9px] font-black text-slate-300 uppercase">{sub}</span>
    </div>
  </div>
);

const Bar = ({ height, label, value }) => (
  <div className="flex flex-col items-center flex-1 h-full justify-end group">
    <span className="text-[9px] font-black text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity mb-1">{value}</span>
    <div className="w-full max-w-[28px] md:max-w-[40px] bg-gradient-to-b from-emerald-400 to-teal-600 rounded-t-lg shadow-sm transition-all duration-500" style={{ height }}></div>
    <p className="text-[8px] font-black text-slate-400 uppercase mt-2 tracking-tighter truncate w-full text-center">{label}</p>
  </div>
);

const HealthItem = ({ label, val, color, bg }) => (
  <div className={`flex justify-between items-center px-4 py-3 ${bg} rounded-xl border border-white`}>
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color}`}></span>
      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
    </div>
    <span className="font-black text-[10px] text-slate-800">{val}</span>
  </div>
);

const ProductCard = ({ name, cat, stock, rack, imageName, isLow }) => {
  const imageUrl = imageName ? `http://localhost:5000/uploads/${imageName}` : null;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm group hover:border-emerald-100 transition-colors">
      <div className="aspect-square bg-slate-50 relative p-3">
          <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
             {imageUrl ? (
               <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
             ) : (
               <i className="fas fa-image text-slate-200 text-2xl"></i>
             )}
          </div>
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[7px] font-black uppercase text-white shadow-sm ${isLow ? 'bg-blue-500' : 'bg-emerald-500'}`}>
            {isLow ? 'Reorder' : 'Ready'}
          </div>
      </div>
      <div className="p-3">
          <div className="flex justify-between items-center mb-1 gap-2">
            <p className="text-[8px] font-black text-slate-400 uppercase truncate w-1/2">{cat}</p>
            <span className={`text-[9px] font-black ${isLow ? 'text-blue-600' : 'text-emerald-600'}`}>{stock} UNIT</span>
          </div>
          <h4 className="font-black text-slate-800 text-[10px] md:text-xs uppercase truncate mb-3">{name}</h4>
          <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
            <span className="text-[8px] font-bold text-slate-400 italic truncate w-1/2">RAK: {rack}</span>
            <div className="h-1 w-8 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
              <div className={`h-full ${isLow ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min((stock / 20) * 100, 100)}%` }}></div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;