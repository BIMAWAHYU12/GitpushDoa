import React, { useState } from 'react';

const MasterData = () => {
  const [activeTab, setActiveTab] = useState('barang');

  // Data Barang
  const barangData = [
    { id: 1, nama: 'Hype R 5 Touch', kategori: 'Laptop', lokasi: 'B1-R01', stok: 6, img: 'https://via.placeholder.com/60' },
    { id: 2, nama: 'Hype 7 AMD X9', kategori: 'Laptop', lokasi: 'B1-R02', stok: 6, img: 'https://via.placeholder.com/60' },
    { id: 3, nama: 'Galaxy A17', kategori: 'Smartphone', lokasi: 'A1-R05', stok: 11, img: 'https://via.placeholder.com/60' },
  ];

  // Data Outlet
  const outletData = [
    { id: 1, nama: 'iGudang Pusat Jakarta', kategori: 'Warehouse', lokasi: 'Jakarta Pusat', stok: 'Aktif', img: 'https://via.placeholder.com/60' },
    { id: 2, nama: 'iGudang Cabang Bandung', kategori: 'Store', lokasi: 'Dago', stok: 'Aktif', img: 'https://via.placeholder.com/60' },
  ];

  const currentData = activeTab === 'barang' ? barangData : outletData;

  return (
    <div className="w-full space-y-6 animate-fadeIn text-left">
      
      {/* 🚀 HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Master data</h1>
          <p className="text-slate-500 font-medium text-sm">Kelola informasi aset dan entitas gudang secara terpusat.</p>
        </div>

        {/* 📑 TAB SWITCHER (Tombol milih Barang/Outlet) */}
        <div className="flex bg-slate-100 p-1 rounded-2xl w-fit border border-slate-200/50 shadow-inner">
          <button 
            onClick={() => setActiveTab('barang')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all tracking-widest uppercase ${activeTab === 'barang' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Barang
          </button>
          <button 
            onClick={() => setActiveTab('outlet')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all tracking-widest uppercase ${activeTab === 'outlet' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Outlet
          </button>
        </div>
      </div>

      {/* 🔍 SEARCH & ACTION BAR */}
      <div className="flex flex-col md:flex-row items-center gap-4 px-1">
        <div className="relative flex-1 w-full">
          <input 
            type="text" 
            placeholder={`Cari ${activeTab}...`} 
            className="w-full pl-6 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all shadow-sm" 
          />
          <i className="fas fa-search absolute right-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
        </div>
        <button className="w-full md:w-auto bg-gradient-to-r from-[#0D9488] to-[#1E40AF] text-white px-8 py-3.5 rounded-2xl font-black text-[11px] tracking-widest shadow-lg shadow-teal-500/20 active:scale-95 transition-all uppercase">
          + Tambah {activeTab}
        </button>
      </div>

      {/* 📦 TABLE CONTAINER (Clean Typography) */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]"> 
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-6 uppercase font-black">Informasi {activeTab}</th>
                <th className="px-8 py-6 uppercase font-black">Kategori</th>
                <th className="px-8 py-6 text-center uppercase font-black">Lokasi</th>
                <th className="px-8 py-6 text-center uppercase font-black">{activeTab === 'barang' ? 'Stok' : 'Status'}</th>
                <th className="px-8 py-6 text-right uppercase font-black">Aksi</th>
              </tr>
            </thead>
            {/* Ganti bagian <tbody> di dalam tabel lu dengan kode ini bre */}
<tbody className="divide-y divide-slate-50 text-left">
  {currentData.map((item) => (
    <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
      
      {/* 📦 INFORMASI PRODUK: Nama barang dibuat Semibold biar clean */}
      <td className="px-8 py-5">
        <div className="flex items-center gap-4 text-left">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 flex-shrink-0 shadow-sm">
            <img 
              src={item.img} 
              alt="" 
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" 
            />
          </div>
          <div className="text-left">
            <p className="font-semibold text-slate-800 text-sm tracking-tight leading-tight mb-1 ">
              {item.nama}
            </p>
            <span className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">
              ID: #{item.id}
            </span>
          </div>
        </div>
      </td>

      {/* 🏷️ KATEGORI: Font Medium */}
      <td className="px-8 py-5">
        <span className="bg-teal-50 text-[#0F766E] px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-teal-100/30">
          {item.kategori}
        </span>
      </td>

      {/* 📍 LOKASI: Font Medium */}
      <td className="px-8 py-5 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/50 rounded-xl text-blue-600 font-bold text-[11px]">
          <i className="fas fa-location-dot text-[10px] opacity-40"></i> 
          {item.lokasi}
        </div>
      </td>

      {/* 🔢 STOK/STATUS: Angka tetep Bold biar kontras */}
      <td className="px-8 py-5 text-center">
        <p className="font-black text-emerald-600 text-base leading-none tracking-tighter">
          {item.stok}
        </p>
        <p className="text-[9px] font-medium text-slate-400 uppercase mt-1.5 tracking-tighter italic">
          Update Terakhir
        </p>
      </td>

      {/* ⚙️ AKSI: Clean Icons */}
      <td className="px-8 py-5 text-right">
        <div className="flex justify-end gap-2.5">
          <button className="w-9 h-9 rounded-xl bg-blue-50 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center justify-center border border-blue-100/50">
            <i className="fas fa-qrcode text-xs"></i>
          </button>
          <button className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center justify-center border border-emerald-100/50">
            <i className="fas fa-pen text-xs"></i>
          </button>
          <button className="w-9 h-9 rounded-xl bg-slate-50 text-slate-300 hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center border border-slate-100">
            <i className="fas fa-trash text-xs"></i>
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MasterData;