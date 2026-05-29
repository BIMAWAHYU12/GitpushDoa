import React, { useState, useEffect } from 'react';

const Riwayat = () => {
  const [mutations, setMutations] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetching Data Riwayat dari Backend
  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/riwayat', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Gagal mengambil riwayat');

        // Sesuai format backend lu: result.data
        setMutations(result.data || []);
      } catch (err) {
        console.error("[FETCH RIWAYAT ERROR]:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRiwayat();
  }, []);

  // 2. Logika Filter Client-Side Berdasarkan Range Tanggal
  const filteredMutations = mutations.filter((m) => {
    if (!m.tanggal) return true;
    // Mengambil substring YYYY-MM-DD dari format datetime database
    const mutationDate = m.tanggal.split('T')[0] || m.tanggal.split(' ')[0];
    
    if (startDate && mutationDate < startDate) return false;
    if (endDate && mutationDate > endDate) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans gap-3">
        <div className="w-12 h-12 border-[3.5px] border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 animate-pulse">Generating Audit Logs...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 md:space-y-8 animate-fadeIn text-left">
      
      {/* 🚀 Header: Clean & Consistent */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Riwayat mutasi</h1>
          <p className="text-slate-500 font-medium text-sm">Laporan aktivitas keluar masuk barang inventaris.</p>
        </div>
        <button className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-black text-[11px] tracking-widest shadow-lg flex items-center gap-2 uppercase active:scale-95 transition-all">
          <i className="fas fa-print"></i> Cetak pdf
        </button>
      </div>

      {/* 📅 Filter Section: Pake Warna Identitas iGUDANG */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-6">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dari tanggal</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-emerald-500 transition-all" 
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sampai tanggal</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-emerald-500 transition-all" 
            />
          </div>

          {/* Tombol Filter: Reset filter jika diklik */}
          <button 
            onClick={() => { setStartDate(''); setEndDate(''); }}
            className="bg-gradient-to-r from-[#0D9488] to-[#1E40AF] text-white px-8 py-4 rounded-2xl font-black text-xs tracking-[0.2em] shadow-xl shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase"
          >
            <i className="fas fa-undo text-xs"></i> Reset Filter
          </button>
        </div>
      </div>

      {/* 📦 Data Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Tanggal & Waktu</th>
                <th className="px-8 py-6">Barang</th>
                <th className="px-8 py-6 text-center">Tipe</th>
                <th className="px-8 py-6 text-center">Jumlah</th>
                <th className="px-8 py-6 text-left">Keterangan Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMutations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-slate-400 font-bold text-xs">Tidak ada riwayat mutasi stok pada periode ini.</td>
                </tr>
              ) : (
                filteredMutations.map((m, i) => {
                  // Helper pembagian string date ISO DB (2026-01-07T13:34:35.000Z) atau format standar text
                  const cleanDate = m.tanggal ? (m.tanggal.includes('T') ? m.tanggal.split('T')[0] : m.tanggal.split(' ')[0]) : '-';
                  const cleanTime = m.tanggal ? (m.tanggal.includes('T') ? m.tanggal.split('T')[1].substring(0, 8) : m.tanggal.split(' ')[1] || '') : '';

                  return (
                    <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                      {/* TANGGAL & WAKTU */}
                      <td className="px-8 py-5">
                        <p className="font-semibold text-slate-800 text-sm mb-0.5">{cleanDate}</p>
                        <p className="font-medium text-slate-400 text-[11px]">{cleanTime}</p>
                      </td>

                      {/* NAMA BARANG */}
                      <td className="px-8 py-5 text-left">
                        <p className="font-semibold text-[#334155] text-sm tracking-tight leading-tight">
                          {m.nama_barang}
                        </p>
                      </td>

                      {/* TIPE MUTASI */}
                      <td className="px-8 py-5 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase ${
                          m.tipe?.toUpperCase() === 'MASUK' || m.tipe?.toUpperCase() === 'IN' 
                            ? 'bg-emerald-50 text-emerald-500' 
                            : 'bg-red-50 text-red-400'
                        }`}>
                          {m.tipe?.toUpperCase() === 'MASUK' ? 'IN' : m.tipe?.toUpperCase() === 'KELUAR' ? 'OUT' : m.tipe}
                        </span>
                      </td>

                      {/* JUMLAH STOK */}
                      <td className={`px-8 py-5 text-center font-bold text-sm ${
                        m.tipe?.toUpperCase() === 'MASUK' || m.tipe?.toUpperCase() === 'IN' ? 'text-emerald-600' : 'text-red-500'
                      }`}>
                        {m.tipe?.toUpperCase() === 'MASUK' || m.tipe?.toUpperCase() === 'IN' ? `+${m.jumlah}` : `-${m.jumlah}`}
                      </td>

                      {/* KETERANGAN KOMPREHENSIF */}
                      <td className="px-8 py-5 text-left">
                        <div className="space-y-0.5">
                          <p className="text-slate-700 font-semibold text-xs">
                            {m.keterangan ? `"${m.keterangan}"` : '"Tanpa Catatan"'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            Pic: <span className="text-slate-500 font-bold">{m.nama_petugas}</span> 
                            {m.asal_supplier !== '-' && <> • Dari: <span className="text-teal-600 font-bold">{m.asal_supplier}</span></>}
                            {m.tujuan_outlet !== '-' && <> • Ke: <span className="text-blue-600 font-bold">{m.tujuan_outlet}</span></>}
                          </p>
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

export default Riwayat;