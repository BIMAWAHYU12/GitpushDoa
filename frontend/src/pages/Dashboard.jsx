import React from 'react';

const Dashboard = () => {
  return (
    <div className="space-y-4 md:space-y-6 pb-10 max-w-[1400px] mx-auto">
      
      {/* 🗓️ HEADER SECTION: Clean & Flat */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h4 className="text-[10px] md:text-xs font-black text-emerald-600 uppercase tracking-[0.3em] mb-1">Status Sistem: Online</h4>
          <div className="flex items-center gap-2 text-slate-400">
            <i className="fas fa-calendar-day text-xs"></i>
            <span className="text-[11px] font-bold uppercase">Selasa, 13 Januari 2026</span>
          </div>
        </div>
        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center relative shadow-sm">
          <i className="fas fa-bell text-slate-400"></i>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
        </div>
      </div>

      {/* 🚀 HERO SECTION: Padat & Bold (Gak kegedean) */}
      <div className="bg-gradient-to-r from-[#0D9488] to-[#1E40AF] rounded-3xl p-6 md:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl md:text-4xl font-black tracking-tight leading-none uppercase mb-2">Selamat Datang, Admin</h2>
          <p className="text-white/70 text-[10px] md:text-base font-medium max-w-md">Kelola mutasi stok barang elektronik dengan presisi real time.</p>
        </div>
        <i className="fas fa-box-open absolute -bottom-6 -right-6 text-8xl text-white/10 -rotate-12"></i>
      </div>

      {/* 📊 SUMMARY CARDS: 2 Kolom di HP (Sangat Rapi) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard label="DATA BARANG" value="12" sub="SKU" icon="fa-barcode" color="text-emerald-600" />
        <StatCard label="STOK FISIK" value="70" sub="Unit" icon="fa-box" color="text-blue-600" />
        <StatCard label="RE-ORDER" value="04" sub="Item" icon="fa-clock-rotate-left" color="text-teal-600" />
        <StatCard label="ESTIMASI ASET" value="85" sub="Juta" icon="fa-wallet" color="text-slate-800" />
      </div>

      {/* 📈 ANALITIK & STATUS: Padat Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* GRAFIK (Lebih Clean) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
              <i className="fas fa-chart-line text-xs"></i>
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Analitik Stok Terbanyak</h3>
          </div>
          <div className="h-44 md:h-64 flex items-end justify-between px-2 gap-3 md:gap-6 border-b border-slate-50 pb-2">
            <Bar height="95%" label="GA17" />
            <Bar height="80%" label="AXIO" />
            <Bar height="70%" label="IP17" />
            <Bar height="55%" label="JETE" />
            <Bar height="40%" label="OPPO" />
          </div>
        </div>

        {/* KESEHATAN (Ringkas) */}
        <div className="bg-white rounded-3xl p-5 md:p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
           <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
             <i className="fas fa-heart-pulse text-blue-500"></i> Kondisi Gudang
           </h3>
           <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                    <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="251" strokeDashoffset="80" className="text-emerald-500" strokeLinecap="round" />
                 </svg>
                 <p className="absolute text-xl md:text-3xl font-black text-slate-800">67%</p>
              </div>
              <div className="w-full mt-6 space-y-2">
                 <HealthItem label="AMAN" val="8 SKU" color="bg-emerald-500" bg="bg-emerald-50" />
                 <HealthItem label="RE-ORDER" val="4 SKU" color="bg-blue-500" bg="bg-blue-50" />
              </div>
           </div>
        </div>
      </div>

      {/* 📦 KATALOG LIVE: Padat & Presisi */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-slate-800 uppercase tracking-[0.2em] text-xs">Update Katalog Live</h3>
          <div className="text-[9px] font-bold text-slate-400 uppercase italic">Real-time Data</div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
           <ProductCard name="iPhone 17 Pro" cat="Phone" stock="9" rack="A1" />
           <ProductCard name="Axioo MyBook" cat="Laptop" stock="10" rack="B1" />
           <ProductCard name="Charger Head" cat="Access" stock="3" rack="C2" isLow />
           <ProductCard name="JETE Power" cat="Access" stock="8" rack="C2" />
        </div>
      </div>

    </div>
  );
};

// --- SUB-COMPONENTS (OPTIMIZED) ---

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

const Bar = ({ height, label }) => (
  <div className="flex flex-col items-center flex-1 h-full">
    <div className="w-full max-w-[28px] md:max-w-[40px] bg-gradient-to-b from-emerald-400 to-teal-600 rounded-t-lg shadow-sm" style={{ height }}></div>
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

const ProductCard = ({ name, cat, stock, rack, isLow }) => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm group">
    <div className="aspect-square bg-slate-50 relative p-3">
       <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
          <i className="fas fa-image text-slate-200"></i>
       </div>
       <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[7px] font-black uppercase text-white shadow-sm ${isLow ? 'bg-blue-500' : 'bg-emerald-500'}`}>
         {isLow ? 'Reorder' : 'Ready'}
       </div>
    </div>
    <div className="p-3">
       <div className="flex justify-between items-center mb-1">
         <p className="text-[8px] font-black text-slate-400 uppercase truncate w-1/2">{cat}</p>
         <span className={`text-[9px] font-black ${isLow ? 'text-blue-600' : 'text-emerald-600'}`}>{stock} UNIT</span>
       </div>
       <h4 className="font-black text-slate-800 text-[10px] md:text-xs uppercase truncate mb-3">{name}</h4>
       <div className="flex items-center justify-between">
         <span className="text-[8px] font-bold text-slate-400 italic">RAK: {rack}</span>
         <div className="h-1 w-8 bg-slate-100 rounded-full overflow-hidden">
           <div className={`h-full ${isLow ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{ width: isLow ? '30%' : '80%' }}></div>
         </div>
       </div>
    </div>
  </div>
);

export default Dashboard;