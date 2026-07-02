import React, { useState, useEffect } from 'react';

const Riwayat = () => {
  const [mutations, setMutations] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); 
  const [isLoading, setIsLoading] = useState(true);

  // State untuk kontrol Expandable Row (Berisi ID Batch / Timestamp)
  const [expandedRow, setExpandedRow] = useState(null);

  // 1. Fetching Data & GROUPING
  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/riwayat', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Gagal mengambil riwayat');

        // 🔥 LOGIKA GROUPING BERDASARKAN WAKTU TRANSAKSI
        // Karena bulk insert berjalan di detik yang sama, kita kelompokkan berdasarkan 'tanggal'
        const groupedMap = {};
        
        (result.data || []).forEach(m => {
          // Jadikan timestamp sebagai ID unik batch transaksi
          const batchId = m.tanggal; 
          
          if (!groupedMap[batchId]) {
            groupedMap[batchId] = {
              batch_id: batchId,
              tanggal: m.tanggal,
              tipe: m.tipe,
              keterangan: m.keterangan,
              nama_petugas: m.nama_petugas,
              asal_supplier: m.asal_supplier,
              tujuan_outlet: m.tujuan_outlet,
              bukti_foto: m.bukti_foto, // Tangkap bukti foto
              total_qty: 0,
              items: [] // Array untuk menampung rincian barang di transaksi ini
            };
          }

          // Masukkan barang ke dalam batch
          groupedMap[batchId].items.push({
            id_transaksi: m.id_transaksi,
            nama_barang: m.nama_barang,
            jumlah: m.jumlah,
            satuan: m.satuan || 'Pcs'
          });

          groupedMap[batchId].total_qty += parseInt(m.jumlah);
          
          // Jaga-jaga jika foto ada di row barang kedua/ketiga
          if (!groupedMap[batchId].bukti_foto && m.bukti_foto) {
            groupedMap[batchId].bukti_foto = m.bukti_foto;
          }
        });

        // Convert Map jadi Array dan urutkan dari yang paling baru
        const groupedArray = Object.values(groupedMap).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
        
        setMutations(groupedArray);
      } catch (err) {
        console.error("[FETCH RIWAYAT ERROR]:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRiwayat();
  }, []);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // 2. Logika Filter Client-Side (Mencari di dalam Group & Item)
  const filteredMutations = mutations.filter((m) => {
    if (m.tanggal) {
      const mutationDate = m.tanggal.split('T')[0] || m.tanggal.split(' ')[0];
      if (startDate && mutationDate < startDate) return false;
      if (endDate && mutationDate > endDate) return false;
    }

    const query = searchQuery.toLowerCase();
    const matchesPetugas = m.nama_petugas?.toLowerCase().includes(query);
    const matchesKeterangan = m.keterangan?.toLowerCase().includes(query);
    // Cari juga apakah ada nama barang di dalam keranjang transaksi ini yang cocok
    const matchesBarang = m.items.some(item => item.nama_barang?.toLowerCase().includes(query));

    return matchesPetugas || matchesKeterangan || matchesBarang;
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans gap-3 bg-[#F6F6F2]">
        <div className="w-12 h-12 border-[3.5px] border-[#388087] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#388087] animate-pulse">Generating Audit Logs...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 md:space-y-8 animate-fadeIn text-left font-sans bg-[#F6F6F2] min-h-screen pt-2 px-1 text-[#388087]">
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          button, .no-print, input, select, .sidebar, .navbar { display: none !important; }
          body { background: white !important; color: black !important; padding: 0 !important; margin: 0 !important; }
          .print-container { border: none !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important; width: 100% !important; }
          tr { page-break-inside: avoid !important; page-break-after: auto !important; }
          table { width: 100% !important; border-collapse: collapse !important; }
          th, td { padding: 12px 8px !important; border-bottom: 1px solid #cbd5e1 !important; }
          .expand-area { display: block !important; }
        }
      `}} />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-[#388087]">Riwayat Mutasi</h1>
          <p className="text-slate-500 font-medium text-sm">Laporan aktivitas keluar masuk logistik (Batch Transactions).</p>
        </div>
        <button onClick={handlePrint} className="bg-[#388087] hover:bg-[#2a636b] text-white px-6 py-3.5 rounded-2xl font-black text-[11px] tracking-widest shadow-md shadow-[#388087]/10 flex items-center gap-2.5 uppercase active:scale-95 transition-all no-print">
          <i className="fas fa-print text-xs"></i> Cetak PDF
        </button>
      </div>

      {/* FILTER SECTION */}
      <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#BADFE7]/60 shadow-sm no-print">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end gap-5">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Cari Keyword</label>
            <div className="relative">
              <input type="text" placeholder="Nama produk / PIC..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-5 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#388087] h-[46px]" />
              <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-[#388087]/50 text-xs"></i>
            </div>
          </div>
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Dari Tanggal</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 focus:outline-none focus:border-[#388087] h-[46px]" />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Sampai Tanggal</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 focus:outline-none focus:border-[#388087] h-[46px]" />
          </div>
          <button type="button" onClick={() => { setStartDate(''); setEndDate(''); setSearchQuery(''); }} className="bg-[#388087] hover:bg-[#2a636b] text-white px-6 h-[46px] rounded-2xl font-black text-[11px] tracking-widest flex items-center justify-center gap-2 uppercase">
            <i className="fas fa-undo text-xs"></i> Reset Filter
          </button>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-[32px] shadow-[0_4px_25px_rgba(56,128,135,0.02)] border border-[#BADFE7]/60 overflow-hidden print-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-[#BADFE7]/20 border-b border-[#BADFE7]/40">
              <tr className="text-[10px] font-black text-[#388087]/60 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Waktu Mutasi</th>
                <th className="px-8 py-6 text-center">Tipe</th>
                <th className="px-8 py-6 text-center">Volume Total</th>
                <th className="px-8 py-6 text-left">Keterangan / PIC</th>
                <th className="px-8 py-6 text-center no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredMutations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-slate-400 font-bold text-xs">Tidak ada riwayat mutasi stok pada periode ini.</td>
                </tr>
              ) : (
                filteredMutations.map((m) => {
                  const isStockIn = m.tipe?.toUpperCase() === 'MASUK' || m.tipe?.toUpperCase() === 'IN';
                  const cleanDate = m.tanggal ? (m.tanggal.includes('T') ? m.tanggal.split('T')[0] : m.tanggal.split(' ')[0]) : '-';
                  const cleanTime = m.tanggal ? (m.tanggal.includes('T') ? m.tanggal.split('T')[1].substring(0, 8) : m.tanggal.split(' ')[1] || '') : '';
                  const totalJenisBarang = m.items.length;

                  return (
                    <React.Fragment key={m.batch_id}>
                      {/* BARIS UTAMA (HEADER TRANSAKSI) */}
                      <tr 
                        onClick={() => toggleRow(m.batch_id)}
                        className={`cursor-pointer transition-all group ${expandedRow === m.batch_id ? 'bg-[#BADFE7]/10' : 'hover:bg-[#BADFE7]/5'}`}
                      >
                        <td className="px-8 py-5">
                          <p className="font-bold text-slate-800 text-sm mb-0.5">{cleanDate}</p>
                          <p className="font-semibold text-slate-400 text-[11px]"><i className="far fa-clock mr-1"></i>{cleanTime}</p>
                        </td>

                        <td className="px-8 py-5 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase border ${
                            isStockIn ? 'bg-emerald-50 text-[#388087] border-emerald-200/50' : 'bg-rose-50 text-rose-500 border-rose-200/50'
                          }`}>
                            <i className={`fas ${isStockIn ? 'fa-arrow-down-left' : 'fa-arrow-up-right'} text-[8px]`}></i>
                            {isStockIn ? 'IN' : 'OUT'}
                          </span>
                        </td>

                        <td className="px-8 py-5 text-center">
                           <p className={`font-black text-base tracking-tight ${isStockIn ? 'text-[#388087]' : 'text-rose-500'}`}>
                              {isStockIn ? `+${m.total_qty}` : `-${m.total_qty}`}
                           </p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">({totalJenisBarang} Item)</p>
                        </td>

                        <td className="px-8 py-5 text-left">
                          <div className="space-y-1">
                            <p className="text-slate-700 font-bold text-xs leading-relaxed truncate max-w-[250px]">
                              {m.keterangan ? `"${m.keterangan}"` : '"Tanpa Catatan"'}
                            </p>
                            <p className="text-[10px] font-black text-slate-400">
                              <span>PIC: <strong className="text-slate-600 font-black">{m.nama_petugas}</strong></span>
                            </p>
                          </div>
                        </td>

                        <td className="px-8 py-5 text-center no-print">
                          <i className={`fas fa-chevron-${expandedRow === m.batch_id ? 'up' : 'down'} text-slate-400 group-hover:text-[#388087] transition-colors bg-white w-8 h-8 rounded-full shadow-sm leading-8 border border-slate-100`}></i>
                        </td>
                      </tr>

                      {/* BARIS EXPAND (DETAIL BARANG & FOTO) */}
                      {expandedRow === m.batch_id && (
                        <tr className="bg-white border-b-2 border-[#BADFE7]/30 expand-area">
                          <td colSpan="5" className="px-8 py-8 bg-gradient-to-b from-[#BADFE7]/5 to-white">
                            <div className="flex flex-col lg:flex-row gap-8 items-start animate-fadeIn">
                              
                              {/* Kiri: Detail Rincian & Tabel Barang */}
                              <div className="flex-1 w-full space-y-5">
                                {/* Info Partner */}
                                <div className="flex flex-wrap gap-3">
                                  {m.asal_supplier && m.asal_supplier !== '-' && (
                                    <div className="bg-white border border-emerald-100 px-4 py-3 rounded-xl shadow-sm text-slate-600 flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><i className="fas fa-truck text-xs"></i></div>
                                      <div className="text-left">
                                        <p className="text-[9px] font-black uppercase text-slate-400">Asal Supplier</p>
                                        <p className="text-xs font-black text-emerald-700">{m.asal_supplier}</p>
                                      </div>
                                    </div>
                                  )}

                                  {m.tujuan_outlet && m.tujuan_outlet !== '-' && (
                                    <div className="bg-white border border-blue-100 px-4 py-3 rounded-xl shadow-sm text-slate-600 flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><i className="fas fa-store text-xs"></i></div>
                                      <div className="text-left">
                                        <p className="text-[9px] font-black uppercase text-slate-400">Tujuan Distribusi</p>
                                        <p className="text-xs font-black text-blue-700">{m.tujuan_outlet}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Tabel Rincian Keranjang */}
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                  <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                      <tr className="text-[9px] font-black text-slate-400 uppercase">
                                        <th className="px-4 py-3">Nama Asset Barang</th>
                                        <th className="px-4 py-3 text-center">Kuantitas</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {m.items.map((item, idx) => (
                                        <tr key={idx}>
                                          <td className="px-4 py-3 font-bold text-sm text-slate-800">
                                            <i className="fas fa-cube text-slate-300 mr-2"></i>{item.nama_barang}
                                          </td>
                                          <td className="px-4 py-3 text-center font-black text-[#388087]">
                                            {item.jumlah} <span className="text-xs font-bold text-slate-400">{item.satuan}</span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* Kanan: Foto Bukti */}
                              <div className="w-full lg:w-72 flex flex-col gap-2 shrink-0">
                                <p className="text-[10px] font-black text-[#388087] uppercase tracking-widest mb-1"><i className="fas fa-camera mr-2"></i>Bukti Transaksi Fisik</p>
                                {m.bukti_foto ? (
                                  <div 
                                    className="w-full h-56 rounded-2xl overflow-hidden border-4 border-white shadow-xl cursor-pointer relative group"
                                    onClick={() => window.open(`http://localhost:5000/uploads/${m.bukti_foto}`, '_blank')}
                                  >
                                    <img 
                                      src={`http://localhost:5000/uploads/${m.bukti_foto}`} 
                                      alt="Bukti" 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                                      <i className="fas fa-expand text-2xl mb-2"></i>
                                      <span className="text-[10px] font-black uppercase tracking-widest">Perbesar Foto</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-full h-56 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300">
                                    <i className="fas fa-image-slash text-4xl mb-3 opacity-40"></i>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tidak Melampirkan Foto</span>
                                  </div>
                                )}
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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