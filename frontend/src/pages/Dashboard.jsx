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
  
  // State data master dari database
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState('');

  // Fitur Pencarian & Filter Kategori
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Sistem Pagination (Halaman)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  // State Manajemen Notifikasi & Detail Modal
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dropdownRef = useRef(null);

  const adminName = localStorage.getItem('username') || 'Admin';

  // Handler nutup notif otomatis
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

        // Generate Notifikasi Internal
        const listNotif = [];
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

  // Reset ke halaman 1 kalau user ngetik pencarian atau ganti kategori
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // ================= LOGIKA CHART, SEARCH & FILTER DATA =================
  const topStokProducts = [...allProducts]
    .sort((a, b) => parseInt(b.stok) - parseInt(a.stok))
    .slice(0, 5);

  const maxStok = topStokProducts.length > 0 ? Math.max(...topStokProducts.map(p => parseInt(p.stok))) : 1;
  const itemsLowStock = allProducts.filter(item => parseInt(item.stok) < 5).length;
  const totalItemCount = allProducts.length;
  const safeStockPercentage = totalItemCount > 0 ? Math.round(((totalItemCount - itemsLowStock) / totalItemCount) * 100) : 100;
  const strokeDashoffset = 251 - (251 * safeStockPercentage) / 100;

  // Ekstrak Daftar Kategori Unik dari Database
  const uniqueCategories = ['ALL', ...new Set(allProducts.map(p => (p.nama_kategori || 'Aksesoris').toUpperCase()))];

  // PROSES FILTER & SEARCHING KATA KUNCI
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.nama.toLowerCase().includes(searchQuery.toLowerCase());
    const productCat = (product.nama_kategori || 'Aksesoris').toUpperCase();
    const matchesCategory = selectedCategory === 'ALL' || productCat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // LOGIKA POTONG DATA (PAGINATION)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans gap-4 bg-[#F6F6F2]">
        <div className="w-10 h-10 border-[3px] border-[#388087] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#388087]/70 animate-pulse">Initializing Interface...</p>
      </div>
    );
  }

  return (
    // 🔥 Latar utama paling luar dikunci murni warna Cream Satin (#F6F6F2)
    <div className="w-full bg-[#F6F6F2] min-h-screen text-[#388087] font-sans overflow-x-hidden">
      
      {/* Container pembungkus konten inti */}
      <div className="max-w-[1300px] mx-auto space-y-6 md:space-y-8 pb-12 px-4 pt-4">
        
        {/* ─── 🗓️ NAVBAR / TOP HEADER SECTION ─── */}
        <div className="flex items-center justify-between relative z-30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#6FB3B8] animate-pulse"></span>
              <span className="text-[10px] font-black text-[#388087]/50 tracking-widest uppercase">iGUDANG Engine Alpha</span>
            </div>
            <div className="flex items-center gap-2 text-[#388087]/70">
              <i className="far fa-calendar text-xs opacity-70"></i>
              <span className="text-xs font-semibold tracking-tight">{currentDate}</span>
            </div>
          </div>

          {/* 🔔 NOTIFICATION SYSTEM */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="w-10 h-10 bg-white rounded-xl border border-[#BADFE7] flex items-center justify-center relative shadow-sm hover:bg-slate-50 transition-all active:scale-95"
            >
              <i className="far fa-bell text-sm text-[#388087]"></i>
              {notifications.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white shadow-sm">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* DROPDOWN NOTIFIKASI */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl border border-[#BADFE7] shadow-[0_12px_40px_rgba(56,128,135,0.08)] py-4 z-[999] animate-fadeIn max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="px-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-[#388087] tracking-wider uppercase">Notifikasi Sistem</h4>
                  {notifications.length > 0 && (
                    <button onClick={() => setNotifications([])} className="text-[9px] font-bold text-rose-500 uppercase hover:underline tracking-wider">Clear All</button>
                )}
                </div>
                <div className="divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs font-medium">Gudang dalam kondisi aman terkendali.</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-4 flex gap-3 hover:bg-[#BADFE7]/10 transition-colors text-left">
                        <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs ${n.tipe === 'warning' ? 'bg-rose-50 text-rose-500' : 'bg-[#BADFE7]/40 text-[#388087]'}`}>
                          <i className={`fas ${n.icon}`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-700 leading-normal mb-1">{n.text}</p>
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

        {/* ─── 🚀 BRAND HERO PANEL ─── */}
        <div className="bg-gradient-to-br from-[#388087] to-[#2a636b] rounded-[28px] p-6 md:p-8 text-white shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(186,223,231,0.2),transparent_45%)]"></div>
          <div className="relative z-10 space-y-2 max-w-2xl text-left">
            <span className="text-[9px] font-black tracking-[0.25em] text-[#BADFE7] uppercase">Terminal Konsol Kontrol</span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-none text-white">Selamat Datang, {adminName}</h2>
            <p className="text-[#BADFE7] text-xs md:text-sm font-medium leading-relaxed pt-1 opacity-90">
              Panel manajemen logistik iGUDANG mendeteksi hak akses penuh. Monitor metrik ketersediaan komoditas kelontong, audit logs transaksi mutasi, dan optimasi kapasitas ruang penyimpanan secara real-time.
            </p>
          </div>
          <i className="fas fa-cubes absolute -bottom-10 -right-10 text-9xl text-white/5 -rotate-12 pointer-events-none"></i>
        </div>

        {/* ─── 📊 PREMIUM METRIC SUMMARY CARDS (BENTUK PUTIH KONTRAS) ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard label="Total SKU Produk" value={stats.total_barang} sub="Barang" icon="fa-barcode" />
          <StatCard label="Volume Stok Fisik" value={allProducts.reduce((acc, curr) => acc + parseInt(curr.stok), 0)} sub="Unit" icon="fa-boxes-stacked" />
          <StatCard label="Kondisi Kritis" value={itemsLowStock} sub="Restock" icon="fa-triangle-exclamation" isAlert={itemsLowStock > 0} />
          <StatCard label="Log Transaksi" value={stats.total_transaksi} sub="Aktif" icon="fa-clock-rotate-left" />
        </div>

        {/* ─── 📈 ANALYTICS COMPONENT ROW (BENTUK PUTIH KONTRAS) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 🔥 FIX BAR CHART: Berwarna putih kontras dengan pengaturan tiang rapi */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#BADFE7]/50 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-8 text-left">
              <div className="w-8 h-8 bg-[#BADFE7]/40 rounded-xl flex items-center justify-center text-[#388087]">
                <i className="fas fa-chart-simple text-xs"></i>
              </div>
              <div>
                <h3 className="font-black text-[#388087] uppercase tracking-widest text-[10px]">Peringkat Stok Terbanyak</h3>
                <p className="text-[10px] font-medium text-slate-400">Visualisasi 5 item komoditas dengan volume tertinggi</p>
              </div>
            </div>
            {topStokProducts.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-xl">Belum ada data barang.</div>
            ) : (
              <div className="h-56 flex items-end justify-between px-2 gap-4 md:gap-6 border-b border-slate-100 pb-12">
                {topStokProducts.map((item, index) => {
                  const barHeight = maxStok > 0 ? `${(parseInt(item.stok) / maxStok) * 100}%` : '0%';
                  return <Bar key={item.id_barang || index} height={barHeight} label={item.nama} value={`${item.stok}`} />;
                })}
              </div>
            )}
          </div>

          {/* KESEHATAN MATRIKS GUDANG (WARNA PUTIH KONTRAS) */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#BADFE7]/50 shadow-sm flex flex-col justify-between gap-6">
             <div className="flex items-center gap-2 text-left">
               <i className="fas fa-circle-nodes text-[#6FB3B8] text-xs"></i>
               <h3 className="font-black text-[#388087] uppercase tracking-widest text-[10px]">Kapasitas & Kesehatan Stok</h3>
             </div>
             
             <div className="flex flex-col items-center flex-1 justify-center my-auto">
                <div className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center">
                   <svg className="w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                      <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251" strokeDashoffset={strokeDashoffset} className="text-[#388087] transition-all duration-1000" strokeLinecap="round" />
                   </svg>
                   <div className="absolute text-center">
                     <p className="text-2xl font-black tracking-tighter text-[#388087]">{safeStockPercentage}%</p>
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Aman</p>
                   </div>
                </div>
                <div className="w-full mt-6 space-y-2">
                   <HealthItem label="Komoditas Ready" val={`${totalItemCount - itemsLowStock} SKU`} color="bg-[#C2EDCE]" bg="bg-slate-50" />
                   <HealthItem label="Menunggu Restock" val={`${itemsLowStock} SKU`} color="bg-rose-400" bg="bg-rose-50/40" />
                </div>
             </div>

             <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-left">
               <p className="text-[10px] text-slate-400 font-medium leading-relaxed whitespace-normal">
                 Indikator rasio batas aman operasional. Jika rasio turun <span className="text-[#388087] font-bold">di bawah 80%</span>, disarankan segera membuka form mutasi pasokan masuk (*Stock In*).
               </p>
             </div>
          </div>
        </div>

        {/* ─── 📦 CATALOG LIVE SECTION WITH MINIMALIST UI ─── */}
        <div className="space-y-6 pt-5 border-t border-[#BADFE7]/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#388087] rounded-full"></div>
              <h3 className="font-black text-[#388087] uppercase tracking-widest text-xs md:text-sm">Eksplorasi Katalog Live</h3>
            </div>

            {/* SEARCH BAR */}
            <div className="relative w-full sm:w-80 flex items-center">
              <input 
                type="text"
                placeholder="Cari nama barang logistik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-12 py-2.5 bg-white border border-[#BADFE7] rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 outline-none focus:border-[#388087] transition-all shadow-sm"
              />
              <i className="fas fa-search absolute right-4 text-[#388087]/50 text-xs"></i>
            </div>
          </div>

          {/* PILL CAPSULE FILTERS */}
          <div className="flex gap-2 pb-2 overflow-x-auto custom-scrollbar whitespace-nowrap">
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all flex-shrink-0 active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-[#388087] text-white border-[#388087] shadow-sm'
                    : 'bg-white text-[#388087]/60 border border-[#BADFE7] hover:border-[#388087]'
                }`}
              >
                {cat === 'ALL' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>

          {/* GRID LAYOUT DISPLAY KATALOG (PRODUK CARDS BERWARNA PUTIH KONTRAS) */}
          {displayedProducts.length === 0 ? (
             <div className="p-16 text-center border border-dashed border-[#BADFE7] rounded-[24px] text-slate-400 text-xs font-bold bg-white shadow-sm">
               <i className="fas fa-box-open text-lg mb-2 block text-slate-300"></i>
               Tidak ada item barang logistik yang cocok.
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
               {displayedProducts.map((item, index) => (
                 <ProductCard 
                   key={item.id_barang || index}
                   product={item}
                   onCardClick={(productObj) => setSelectedProduct(productObj)}
                 />
               ))}
            </div>
          )}

          {/* PAGINATION PANEL */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                  currentPage === 1
                    ? 'bg-transparent text-slate-300 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-[#388087] border border-[#BADFE7] hover:bg-slate-50 active:scale-95'
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-black transition-all border ${
                    currentPage === i + 1
                      ? 'bg-[#388087] text-white border-[#388087]'
                      : 'bg-white text-[#388087]/60 border border-[#BADFE7] hover:border-[#388087]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                  currentPage === totalPages
                    ? 'bg-transparent text-slate-300 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-[#388087] border border-[#BADFE7] hover:bg-slate-50 active:scale-95'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* ─── 🖼️ SLATE BLUR MODAL DETAILS ─── */}
        {selectedProduct && (
          <div 
            onClick={() => setSelectedProduct(null)} 
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn"
          >
            <div 
              className="bg-white rounded-[28px] shadow-[0_20px_50px_rgba(56,128,135,0.12)] border border-[#BADFE7] max-w-lg w-full relative animate-scaleUp overflow-hidden p-6 md:p-8"
              onClick={(e) => e.stopPropagation()} 
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 w-8 h-8 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full flex items-center justify-center transition-all active:scale-90"
              >
                <i className="fas fa-times text-xs"></i>
              </button>

              <div className="flex flex-col gap-6 mt-4">
                {/* Image Frame */}
                <div className="w-full aspect-[4/3] bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
                  {selectedProduct.gambar ? (
                    <img src={`http://localhost:5000/uploads/${selectedProduct.gambar}`} alt={selectedProduct.nama} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="text-center text-slate-300">
                      <i className="fas fa-image text-3xl mb-1"></i>
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">No Image Asset</p>
                    </div>
                  )}
                </div>

                {/* Data Content */}
                <div className="space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black tracking-widest text-[#388087] bg-[#BADFE7]/50 px-2 py-0.5 rounded uppercase">
                      {selectedProduct.nama_kategori || `ID: ${selectedProduct.kategori_id}`}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug uppercase">
                      {selectedProduct.nama}
                    </h3>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-[#BADFE7]/60 text-xs font-semibold text-slate-600">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40">
                      <span className="text-slate-400 font-medium">Lokasi Koordinat Rak</span>
                      <span className="text-[#388087] font-black uppercase">Koridor {selectedProduct.nama_rak || selectedProduct.rak_id}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200/40">
                      <span className="text-slate-400 font-medium">Kuantitas Stok Gudang</span>
                      <span className="text-slate-900 font-black text-sm">{selectedProduct.stok} {selectedProduct.satuan || 'Pcs'}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-slate-400 font-medium">Status Distribusi</span>
                      <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${parseInt(selectedProduct.stok) < 5 ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-[#388087] border border-emerald-100'}`}>
                        {parseInt(selectedProduct.stok) < 5 ? '🔴 Perlu Restock' : '🟢 Stok Aman'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ─── 🏢 CARD SUB-COMPONENTS INTERNALS (WHITE KONTRAS) ───
const StatCard = ({ label, value, sub, icon, isAlert }) => (
  <div className="bg-white p-5 md:p-6 rounded-2xl border border-[#BADFE7]/60 shadow-sm relative overflow-hidden group hover:border-[#388087]/50 transition-all text-left">
    <div className="flex justify-between items-start mb-4">
      <p className="text-[9px] font-black text-slate-400 tracking-wider uppercase leading-none">{label}</p>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center border shadow-sm ${
        isAlert ? 'bg-rose-50 text-rose-500 border-rose-100 animate-pulse' : 'bg-[#BADFE7]/40 text-[#388087] border-[#BADFE7]/60'
      }`}>
        <i className={`fas ${icon} text-xs`}></i>
      </div>
    </div>
    <div className="flex items-baseline gap-1">
      <h3 className={`text-2xl md:text-3xl font-black tracking-tight leading-none ${isAlert ? 'text-rose-500' : 'text-[#388087]'}`}>{value}</h3>
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{sub}</span>
    </div>
  </div>
);

// 🔥 FIX SUB-COMPONENT TIANG CHART: Text dipotong aman 2 baris miring agar tidak overlap
const Bar = ({ height, label, value }) => (
  <div className="flex flex-col items-center flex-1 h-full justify-end relative group min-w-0">
    <span className="text-[10px] font-black text-[#388087] mb-1 bg-[#BADFE7]/30 px-2 py-0.5 rounded-md border border-[#BADFE7]/40">
      {value}
    </span>
    <div className="w-full max-w-[20px] md:max-w-[32px] bg-[#388087] hover:bg-[#6FB3B8] rounded-t-md transition-all duration-300 shadow-sm min-h-[4px]" style={{ height }}></div>
    
    {/* Box Teks Nama Produk Rotasi Miring */}
    <div className="absolute top-full mt-2 w-20 md:w-28 text-center left-1/2 -translate-x-1/2">
      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight line-clamp-2 leading-tight break-words" title={label}>
        {label}
      </p>
    </div>
  </div>
);

const HealthItem = ({ label, val, color, bg }) => (
  <div className={`flex justify-between items-center px-4 py-2.5 ${bg} rounded-xl border border-slate-100`}>
    <div className="flex items-center gap-2">
      <span className={`w-1.5 h-1.5 rounded-full ${color}`}></span>
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">{label}</span>
    </div>
    <span className="font-black text-[10px] text-slate-800 tracking-tight">{val}</span>
  </div>
);

const ProductCard = ({ product, onCardClick }) => {
  const { nama, nama_kategori, stok, gambar, satuan } = product;
  const unitCount = parseInt(stok) || 0;
  const imageUrl = gambar ? `http://localhost:5000/uploads/${gambar}` : null;

  return (
    <div 
      onClick={() => onCardClick(product)} 
      className="bg-white rounded-2xl border border-[#BADFE7]/70 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-[320px] overflow-hidden"
    >
      {/* Container Gambar */}
      <div className="h-[180px] w-full bg-slate-50/40 p-4 flex items-center justify-center border-b border-slate-100 flex-shrink-0">
         {imageUrl ? (
           <img src={imageUrl} alt={nama} className="w-full h-full object-contain" />
         ) : (
           <i className="fas fa-box text-slate-200 text-3xl"></i>
         )}
      </div>
      
      {/* Konten bawah (Dibuat padat) */}
      <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[8px] font-black text-[#388087]/50 uppercase tracking-widest block">
              {nama_kategori || 'BARANG'}
            </span>
            <h4 className="font-bold text-slate-800 text-xs uppercase leading-tight line-clamp-2">
              {nama}
            </h4>
          </div>
          
          {/* 🔥 FIX: Stok & Satuan menyatu padat di bawah */}
          <div className="pt-2">
             <div className="text-[10px] font-black text-[#388087] bg-[#BADFE7]/20 px-3 py-1.5 rounded-lg inline-block">
               Stok: {unitCount} {satuan || 'Pcs'}
             </div>
          </div>
      </div>
    </div>
  );
};
export default Dashboard;