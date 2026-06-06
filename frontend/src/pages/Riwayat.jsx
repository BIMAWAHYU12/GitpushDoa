import React, { useState, useEffect } from 'react';

const Riwayat = () => {
  const [mutations, setMutations] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // 🔍 Fitur 2: State pencarian kata kunci
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

        setMutations(result.data || []);
      } catch (err) {
        console.error("[FETCH RIWAYAT ERROR]:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRiwayat();
  }, []);

  // 2. Logika Filter Client-Side Gabungan (Range Tanggal + Live Search)
  const filteredMutations = mutations.filter((m) => {
    // A. Filter Tanggal
    if (m.tanggal) {
      const mutationDate = m.tanggal.split('T')[0] || m.tanggal.split(' ')[0];
      if (startDate && mutationDate < startDate) return false;
      if (endDate && mutationDate > endDate) return false;
    }

    // B. Fitur 2: Filter Pencarian Kata Kunci (Nama Barang, Petugas/PIC, atau Keterangan)
    const query = searchQuery.toLowerCase();
    const matchesBarang = m.nama_barang?.toLowerCase().includes(query);
    const matchesPetugas = m.nama_petugas?.toLowerCase().includes(query);
    const matchesKeterangan = m.keterangan?.toLowerCase().includes(query);

    return matchesBarang || matchesPetugas || matchesKeterangan;
  });

  // Fungsi Handler Cetak Cetak PDF / Print Browser
  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans gap-3">
        <div className="w-12 h-12 border-[3.5px] border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 animate-pulse">Generating Audit Logs...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 md:space-y-8 animate-fadeIn text-left font-sans">
      
      {/* CSS KHUSUS PRINT: Menjamin hasil cetak PDF rapi, bersih, dan tidak terpotong */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* Sembunyikan elemen navigasi, tombol, dan form filter saat print */
          button, .no-print, input, select, .sidebar, .navbar {
            display: none !important;
          }
          /* Atur layout halaman agar penuh dan rapi */
          body {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-container {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          /* Hindari baris tabel terpotong di tengah halaman */
          tr {
            page-break-inside: avoid !important;
            page-break-after: auto !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            padding: 12px 8px !important;
            border-bottom: 1px solid #cbd5e1 !important;
          }
        }
      `}} />

      {/* 🚀 Header: Clean & Consistent */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Riwayat mutasi</h1>
          <p className="text-slate-500 font-medium text-sm">Laporan aktivitas keluar masuk barang inventaris.</p>
        </div>
        {/* Tombol Print Aktif */}
        <button 
          onClick={handlePrint}
          className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3.5 rounded-2xl font-black text-[11px] tracking-widest shadow-lg flex items-center gap-2.5 uppercase active:scale-95 transition-all no-print"
        >
          <i className="fas fa-print text-xs"></i> Cetak pdf
        </button>
      </div>

      {/* 📅 Filter Section: Range Tanggal + Live Search Input (Fitur 2 & 3: Simetris 4 Kolom) */}
      <div className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)] no-print">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end gap-5">
          
          {/* Kolom Pencarian Kata Kunci (Fitur 2) */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cari Keyword</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Nama produk / PIC..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 focus:outline-none focus:border-emerald-500 transition-all shadow-inner h-[46px]" 
              />
              <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs"></i>
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dari tanggal</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 focus:outline-none focus:border-emerald-500 transition-all h-[46px]" 
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sampai tanggal</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 focus:outline-none focus:border-emerald-500 transition-all h-[46px]" 
            />
          </div>

          {/* Tombol Reset Filter */}
          <button 
            type="button"
            onClick={() => { setStartDate(''); setEndDate(''); setSearchQuery(''); }}
            className="bg-gradient-to-r from-[#0D9488] to-[#1E40AF] text-white px-6 h-[46px] rounded-2xl font-black text-[11px] tracking-[0.15em] shadow-lg shadow-teal-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase"
          >
            <i className="fas fa-undo text-xs"></i> Reset Filter
          </button>
        </div>
      </div>

      {/* 📦 Data Table (Fitur 3: Layout Simetris & Rapih) */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.01)] border border-slate-100 overflow-hidden print-container">
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
                  const isStockIn = m.tipe?.toUpperCase() === 'MASUK' || m.tipe?.toUpperCase() === 'IN';
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
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors">
                            <i className="fas fa-box text-xs"></i>
                          </div>
                          <p className="font-semibold text-[#334155] text-sm tracking-tight leading-tight">
                            {m.nama_barang}
                          </p>
                        </div>
                      </td>

                      {/* TIPE MUTASI (Fitur 3: Simetris Badge dengan Icon Indikator Aliran) */}
                      <td className="px-8 py-5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase border ${
                          isStockIn 
                            ? 'bg-emerald-50/60 text-emerald-600 border-emerald-100/20' 
                            : 'bg-red-50/60 text-red-500 border-red-100/20'
                        }`}>
                          <i className={`fas ${isStockIn ? 'fa-arrow-down-left' : 'fa-arrow-up-right'} text-[8px]`}></i>
                          {isStockIn ? 'IN' : 'OUT'}
                        </span>
                      </td>

                      {/* JUMLAH STOK */}
                      <td className={`px-8 py-5 text-center font-black text-sm tracking-tight ${
                        isStockIn ? 'text-emerald-600' : 'text-red-500'
                      }`}>
                        {isStockIn ? `+${m.jumlah}` : `-${m.jumlah}`}
                      </td>

                      {/* KETERANGAN KOMPREHENSIF */}
                      <td className="px-8 py-5 text-left">
                        <div className="space-y-1">
                          <p className="text-slate-700 font-semibold text-xs leading-relaxed">
                            {m.keterangan ? `"${m.keterangan}"` : '"Tanpa Catatan"'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span>Pic: <strong className="text-slate-500 font-bold">{m.nama_petugas}</strong></span>
                            {m.asal_supplier && m.asal_supplier !== '-' && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span>Dari: <strong className="text-teal-600 font-bold">{m.asal_supplier}</strong></span>
                              </>
                            )}
                            {m.tujuan_outlet && m.tujuan_outlet !== '-' && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span>Ke: <strong className="text-blue-600 font-bold">{m.tujuan_outlet}</strong></span>
                              </>
                            )}
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