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
  const uniqueCategories = ['ALL', ...new Set(allProducts.map(p => (p.nama_kategori || 'AKSESORIS').toUpperCase()))];

  // PROSES FILTER & SEARCHING KATA KUNCI
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.nama.toLowerCase().includes(searchQuery.toLowerCase());
    const productCat = (product.nama_kategori || 'AKSESORIS').toUpperCase();
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans gap-3">
        <div className="w-12 h-12 border-[3.5px] border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 animate-pulse">Loading iGUDANG Matrix...</p>
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

        {/* 🔔 LOGO NOTIFIKASI AKTIF */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center relative shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
          >
            <i className="fas fa-bell text-slate-400"></i>
            {notifications.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                {notifications.length}
              </span>
            )}
          </button>

          {/* DROPDOWN NOTIFIKASI */}
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
                  <div className="p-6 text-center text-slate-400 text-xs font-medium">Gudang dalam kondisi aman terkendali.</div>
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
          <p className="text-white/80 text-[10px] md:text-sm font-semibold max-w-xl leading-relaxed">
            Sistem mendeteksi otoritas penuh pada akun Anda. Gunakan panel dashboard utama ini untuk melakukan monitoring visual, pelacakan audit log transaksi, serta pemeliharaan restock berkala komoditas inventaris gudang secara aman.
          </p>
        </div>
        <i className="fas fa-box-open absolute -bottom-6 -right-6 text-8xl text-white/10 -rotate-12"></i>
      </div>

      {/* 📊 SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard label="DATA BARANG" value={stats.total_barang} sub="SKU" icon="fa-barcode" color="text-emerald-600" />
        <StatCard label="STOK FISIK" value={allProducts.reduce((acc, curr) => acc + parseInt(curr.stok), 0)} sub="Unit" icon="fa-box" color="text-blue-600" />
        <StatCard label="PERLU RESTOCK" value={itemsLowStock} sub="Item" icon="fa-clock-rotate-left" color="text-blue-500" />
        <StatCard label="TOTAL TRANSAKSI" value={stats.total_transaksi} sub="Log" icon="fa-list-check" color="text-slate-800" />
      </div>

      {/* 📈 ANALITIK & STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* GRAFIK INDIKATOR DATA */}
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
                const barHeight = maxStok > 0 ? `${(parseInt(item.stok) / maxStok) * 100}%` : '0%';
                return <Bar key={item.id_barang || index} height={barHeight} label={item.nama} value={`${item.stok} U`} />;
              })}
            </div>
          )}
        </div>

        {/* KESEHATAN GUDANG */}
        <div className="bg-white rounded-3xl p-5 md:p-8 border border-slate-100 shadow-sm flex flex-col justify-between gap-5">
           <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] flex items-center gap-2">
             <i className="fas fa-heart-pulse text-blue-500"></i> Kondisi Gudang
           </h3>
           
           <div className="flex flex-col items-center flex-1 justify-center">
              <div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                    <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="251" strokeDashoffset={strokeDashoffset} className="text-emerald-500 transition-all duration-1000" strokeLinecap="round" />
                 </svg>
                 <p className="absolute text-xl md:text-3xl font-black text-slate-800">{safeStockPercentage}%</p>
              </div>
              <div className="w-full mt-5 space-y-2">
                 <HealthItem label="AMAN" val={`${totalItemCount - itemsLowStock} SKU`} color="bg-emerald-500" bg="bg-emerald-50" />
                 <HealthItem label="PERLU RESTOCK" val={`${itemsLowStock} SKU`} color="bg-blue-500" bg="bg-blue-50" />
              </div>
           </div>

           <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-left">
             <p className="text-[10px] text-slate-500 font-medium whitespace-normal leading-relaxed">
               Indikator menunjukkan persentase ketersediaan komoditas siap distribusi. Jika angka berada <span className="text-blue-600 font-bold">di bawah 80%</span>, disarankan segera membuka form mutasi masuk (*Stock In*) bersama mitra supplier terkait.
             </p>
           </div>
        </div>
      </div>

      {/* 📦 LIVE KATALOG GRUPING WITH COMPLEX FILTERS */}
      <div className="space-y-6 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-[#1E40AF] rounded-md"></div>
            <h3 className="font-black text-slate-800 uppercase tracking-[0.15em] text-sm md:text-base">Katalog Live</h3>
          </div>

          {/* OVAL SEARCH CONTAINER */}
          <div className="relative w-full md:w-96 flex items-center">
            <input 
              type="text"
              placeholder="Cari barang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-14 py-3 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 placeholder-slate-400 outline-none focus:border-slate-400 transition-all shadow-sm"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#1E293B] text-white rounded-full flex items-center justify-center shadow-md shadow-slate-900/10">
              <i className="fas fa-search text-xs"></i>
            </div>
          </div>
        </div>

        {/* PILL CAPSULE FILTERS */}
        <div className="flex flex-wrap gap-2 px-1 pb-1 overflow-x-auto">
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-[9px] font-black tracking-widest uppercase border transition-all active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-[#1E293B] text-white border-[#1E293B] shadow-sm'
                  : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
              }`}
            >
              {cat === 'ALL' ? 'Semua Produk' : cat}
            </button>
          ))}
        </div>

        {/* GRID DISPLAY KATALOG */}
        {displayedProducts.length === 0 ? (
           <div className="p-16 text-center border-2 border-dashed border-slate-100 rounded-[32px] text-slate-400 text-xs font-bold bg-white">
             <i className="fas fa-box-open text-xl mb-2 block text-slate-200"></i>
             Barang tidak ditemukan.
           </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
             {displayedProducts.map((item, index) => (
               <ProductCard 
                 key={item.id_barang || index}
                 product={item}
                 onCardClick={(productObj) => setSelectedProduct(productObj)}
               />
             ))}
          </div>
        )}

        {/* PANEL NAVIGASI PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6 pb-2 animate-fadeIn">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border ${
                currentPage === 1
                  ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 active:scale-95'
              }`}
            >
              <i className="fas fa-chevron-left mr-1 text-[9px]"></i> Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                  currentPage === i + 1
                    ? 'bg-white text-slate-400 border border-slate-200 hover:border-slate-400'
                    : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-400'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border ${
                currentPage === totalPages
                  ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 active:scale-95'
              }`}
            >
              Next <i className="fas fa-chevron-right ml-1 text-[9px]"></i>
            </button>
          </div>
        )}
      </div>

      {/* THE WHITE GLASSMORPHIC PRESET MODAL DETAILS */}
      {selectedProduct && (
        <div 
          onClick={() => setSelectedProduct(null)} 
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn"
        >
          <div 
            className="bg-white rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.06)] border border-slate-100 max-w-2xl w-full relative animate-scaleUp overflow-hidden p-6 md:p-10"
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full flex items-center justify-center transition-all active:scale-90"
            >
              <i className="fas fa-times text-sm"></i>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-4">
              <div className="aspect-square bg-slate-50/50 border border-slate-100 rounded-3xl p-4 flex items-center justify-center overflow-hidden">
                {selectedProduct.gambar ? (
                  <img src={`http://localhost:5000/uploads/${selectedProduct.gambar}`} alt={selectedProduct.nama} className="w-full h-full object-cover rounded-2xl shadow-sm" />
                ) : (
                  <div className="text-center text-slate-300">
                    <i className="fas fa-image text-4xl mb-2"></i>
                    <p className="text-[8px] font-black uppercase tracking-wildest">No Asset</p>
                  </div>
                )}
              </div>

              <div className="space-y-6 text-left h-full flex flex-col justify-center">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black tracking-[0.25em] text-emerald-600 uppercase">
                    {selectedProduct.nama_kategori || `KATEGORI ID: ${selectedProduct.kategori_id}`}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase leading-snug">
                    {selectedProduct.nama}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Posisi Rak</span>
                    <span className="text-xs font-black text-slate-700 uppercase">RAK {selectedProduct.nama_rak || selectedProduct.rak_id}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Volume Unit</span>
                    <span className={`text-sm font-black ${parseInt(selectedProduct.stok) < 5 ? 'text-blue-600' : 'text-emerald-600'}`}>{selectedProduct.stok} SKU</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Status Stok</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${parseInt(selectedProduct.stok) < 5 ? 'text-blue-500' : 'text-emerald-500'}`}>
                      {parseInt(selectedProduct.stok) < 5 ? '🔴 Perlu Restock' : '🟢 Ready Stock'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// --- SUB-COMPONENTS INTERNALS ---
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
  <div className="flex flex-col items-center flex-1 h-full justify-end">
    <span className="text-[9px] font-black text-[#0D9488] mb-1">{value}</span>
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

const ProductCard = ({ product, onCardClick }) => {
  const { nama, nama_kategori, kategori_id, stok, gambar } = product;
  const unitCount = parseInt(stok) || 0;
  const isLowStock = unitCount < 5;
  const imageUrl = gambar ? `http://localhost:5000/uploads/${gambar}` : null;

  return (
    <div 
      onClick={() => onCardClick(product)} 
      className="bg-white rounded-[24px] border border-slate-100/80 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.015)] group hover:shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:border-slate-200 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div className="aspect-square bg-slate-50/40 relative p-4 flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 group-hover:scale-[1.03] transition-transform duration-300">
             {imageUrl ? (
               <img src={imageUrl} alt={nama} className="w-full h-full object-cover select-none" />
             ) : (
               <i className="fas fa-image text-slate-200 text-3xl"></i>
             )}
          </div>
          <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[9px] font-black tracking-wide shadow-sm text-center z-10 ${
            isLowStock ? 'bg-[#EF4444] text-white' : 'bg-white text-slate-700 border border-slate-100'
          }`}>
            {unitCount} Unit
          </div>
      </div>
      <div className="p-5 pt-0 text-left space-y-1.5 flex-1 flex flex-col justify-between">
          {/* Pembungkus teks deskripsi dengan flex-col & h tetap untuk judul agar simetris lurus */}
          <div className="flex flex-col justify-end flex-1 pt-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider truncate mb-1">
              {nama_kategori || `ID_CAT: ${kategori_id}`}
            </p>
            {/* Mengunci tinggi box text judul agar nama 1 baris maupun 2 baris selalu sejajar horizontal */}
            <div className="h-[36px] flex items-center">
              <h4 className="font-bold text-[#1E293B] text-xs sm:text-sm tracking-tight leading-tight uppercase line-clamp-2 group-hover:text-[#0D9488] transition-colors">
                {nama}
              </h4>
            </div>
          </div>
          <div className="pt-2">
            <div className="h-[3.5px] w-full bg-slate-100 rounded-full overflow-hidden p-[0.5px]">
              <div className={`h-full rounded-full transition-all duration-500 ${isLowStock ? 'bg-[#EF4444]' : 'bg-[#10B981]'}`} style={{ width: `${Math.min((unitCount / 20) * 100, 100)}%` }}></div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;