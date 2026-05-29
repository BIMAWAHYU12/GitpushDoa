import React, { useState, useEffect } from 'react';

const DataBarang = () => {
  const [barangData, setBarangData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/barang', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Gagal mengambil data barang');

        // Sesuaikan dengan format return backend (array atau didalam objek data)
        const finalData = Array.isArray(result) ? result : result.data || [];
        setBarangData(finalData);
      } catch (err) {
        console.error("[FETCH BARANG ERROR]:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarang();
  }, []);

  // Filter pencarian berdasarkan nama barang atau kategori
  const filteredBarang = barangData.filter(item => 
    item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nama_kategori?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans gap-3">
        <div className="w-12 h-12 border-[3.5px] border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 animate-pulse">Loading Inventory Matrix...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-fadeIn text-left font-sans">
      
      {/* 🚀 HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">DATA BARANG</h1>
          <p className="text-slate-500 font-medium text-sm">Kelola aset logistik dan informasi spesifikasi barang secara real-time.</p>
        </div>
      </div>

      {/* 🔍 SEARCH & ACTION BAR */}
      <div className="flex flex-col md:flex-row items-center gap-4 px-1">
        <div className="relative flex-1 w-full">
          <input 
            type="text" 
            placeholder="Cari barang berdasarkan nama atau kategori..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all shadow-sm" 
          />
          <i className="fas fa-search absolute right-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
        </div>
        <button className="w-full md:w-auto bg-gradient-to-r from-[#0D9488] to-[#1E40AF] text-white px-8 py-3.5 rounded-2xl font-black text-[11px] tracking-widest shadow-lg shadow-teal-500/20 active:scale-95 transition-all uppercase">
          + Tambah Barang
        </button>
      </div>

      {/* 📦 TABLE CONTAINER */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]"> 
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Informasi Barang</th>
                <th className="px-8 py-6">Kategori</th>
                <th className="px-8 py-6 text-center">Lokasi Rak</th>
                <th className="px-8 py-6 text-center">Stok</th>
                <th className="px-8 py-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-left">
              {filteredBarang.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-slate-400 font-bold text-xs">Tidak ada data barang yang ditemukan.</td>
                </tr>
              ) : (
                filteredBarang.map((item) => {
                  const imageUrl = item.gambar ? `http://localhost:5000/uploads/${item.gambar}` : null;
                  return (
                    <tr key={item.id_barang} className="hover:bg-slate-50/50 transition-all group">
                      
                      {/* INFORMASI PRODUK */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 flex-shrink-0 shadow-sm flex items-center justify-center">
                            {imageUrl ? (
                              <img src={imageUrl} alt="" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
                            ) : (
                              <i className="fas fa-image text-slate-300 text-xl"></i>
                            )}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-slate-800 text-sm tracking-tight leading-tight mb-1">
                              {item.nama}
                            </p>
                            <span className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">
                              ID: #{item.id_barang}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* KATEGORI */}
                      <td className="px-8 py-5">
                        <span className="bg-teal-50 text-[#0F766E] px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-teal-100/30">
                          {item.nama_kategori || `ID Cat: ${item.kategori_id}`}
                        </span>
                      </td>

                      {/* LOKASI RAK */}
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/50 rounded-xl text-blue-600 font-bold text-[11px]">
                          <i className="fas fa-location-dot text-[10px] opacity-40"></i> 
                          {item.nama_rak || `ID Rak: ${item.rak_id}`}
                        </div>
                      </td>

                      {/* STOK */}
                      <td className="px-8 py-5 text-center">
                        <p className={`font-black text-base leading-none tracking-tighter ${parseInt(item.stok) < 5 ? 'text-blue-600' : 'text-emerald-600'}`}>
                          {item.stok}
                        </p>
                        <p className="text-[9px] font-medium text-slate-400 uppercase mt-1.5 tracking-tighter italic">
                          Unit Ready
                        </p>
                      </td>

                      {/* AKSI */}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataBarang;