import React, { useState, useEffect } from 'react';

const DataOutlet = () => {
  const [outletData, setOutletData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOutlet = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Tembak API Master Data Outlet Backend Lu
        const response = await fetch('http://localhost:5000/api/outlet', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Token ditaro di header
          }
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Gagal mengambil data outlet');

        // Mapping array data dari backend
        const finalData = Array.isArray(result) ? result : result.data || [];
        setOutletData(finalData);
      } catch (err) {
        console.error("[FETCH OUTLET ERROR]:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOutlet();
  }, []);

  // Filter pencarian berdasarkan nama outlet atau alamat/wilayah kota
  const filteredOutlet = outletData.filter(item => 
    item.nama_outlet?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lokasi_outlet?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans gap-3">
        <div className="w-12 h-12 border-[3.5px] border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 animate-pulse">Loading Terminal Nodes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-600 rounded-3xl text-sm font-bold text-center max-w-md mx-auto mt-20">
        ⚠️ Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-fadeIn text-left font-sans">
      
      {/* 🚀 HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Data Outlet</h1>
          <p className="text-slate-500 font-medium text-sm">Kelola jaringan distribusi node dan lokasi outlet iGUDANG resmi.</p>
        </div>
      </div>

      {/* 🔍 SEARCH & ACTION BAR */}
      <div className="flex flex-col md:flex-row items-center gap-4 px-1">
        <div className="relative flex-1 w-full">
          <input 
            type="text" 
            placeholder="Cari outlet berdasarkan nama atau wilayah..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all shadow-sm" 
          />
          <i className="fas fa-search absolute right-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
        </div>
        <button className="w-full md:w-auto bg-gradient-to-r from-[#0D9488] to-[#1E40AF] text-white px-8 py-3.5 rounded-2xl font-black text-[11px] tracking-widest shadow-lg shadow-teal-500/20 active:scale-95 transition-all uppercase">
          + Tambah Outlet
        </button>
      </div>

      {/* 📦 TABLE CONTAINER (Desain Clean Putih-Abu) */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]"> 
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Informasi Jaringan Outlet</th>
                <th className="px-8 py-6">Tipe Node</th>
                <th className="px-8 py-6 text-center">Wilayah / Alamat</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-left">
              {filteredOutlet.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-slate-400 font-bold text-xs">Tidak ada jaringan outlet yang terdaftar.</td>
                </tr>
              ) : (
                filteredOutlet.map((item) => (
                  <tr key={item.id_outlet} className="hover:bg-slate-50/50 transition-all group">
                    
                    {/* INFORMASI OUTLET */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4 text-left">
                        {/* Wrapper Icon Kotak Sesuai Tema Sidebar Lu */}
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 flex-shrink-0 shadow-sm flex items-center justify-center">
                          <i className="fas fa-shop text-[#0F766E] text-lg transition-transform group-hover:scale-110 duration-300"></i>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-slate-800 text-sm tracking-tight leading-tight mb-1">
                            {item.nama_outlet}
                          </p>
                          <span className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">
                            ID NOD: #{item.id_outlet}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* TIPE NODE */}
                    <td className="px-8 py-5">
                      <span className="bg-teal-50 text-[#0F766E] px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-teal-100/30">
                        {item.id_outlet === 1 ? 'Warehouse / Pusat' : 'Store / Cabang'}
                      </span>
                    </td>

                    {/* WILAYAH / ALAMAT (Ngambil Field `lokasi_outlet` Asli dari DB) */}
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/50 rounded-xl text-blue-600 font-bold text-[11px]">
                        <i className="fas fa-location-dot text-[10px] opacity-40"></i> 
                        {item.lokasi_outlet}
                      </div>
                    </td>

                    {/* STATUS OPERATION */}
                    <td className="px-8 py-5 text-center">
                      <p className="font-black text-emerald-600 text-base leading-none tracking-tighter">
                        ONLINE
                      </p>
                      <p className="text-[9px] font-medium text-slate-400 uppercase mt-1.5 tracking-tighter italic">
                        Node Operational
                      </p>
                    </td>

                    {/* AKSI BUTTONS */}
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2.5">
                        <button className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center justify-center border border-emerald-100/50">
                          <i className="fas fa-pen text-xs"></i>
                        </button>
                        <button className="w-9 h-9 rounded-xl bg-slate-50 text-slate-300 hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center border border-slate-100">
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataOutlet;