import React from 'react';

const Riwayat = () => {
  const mutations = [
    { id: 1, tanggal: '2026-01-07', waktu: '21:46:12.684004', barang: 'Ip 17 pro max', tipe: 'OUT', jumlah: '-3', ket: 'kontan' },
    { id: 2, tanggal: '2026-01-07', waktu: '21:24:14.900783', barang: 'Ip 17 pro max', tipe: 'IN', jumlah: '+12', ket: '' },
    { id: 3, tanggal: '2026-01-07', waktu: '13:38:50.242046', barang: 'Axioo MyBook', tipe: 'IN', jumlah: '+10', ket: '' },
    { id: 4, tanggal: '2026-01-07', waktu: '13:34:35.20924', barang: 'Polytron Smart Cinemax Google TV 32 Inch', tipe: 'IN', jumlah: '+3', ket: '' },
  ];

  return (
    <div className="w-full space-y-6 md:space-y-8 animate-fadeIn text-left">
      
      {/* 🚀 Header: Clean & Consistent */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Riwayat mutasi</h1>
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
            <input type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-emerald-500 transition-all" />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sampai tanggal</label>
            <input type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-emerald-500 transition-all" />
          </div>

          {/* Tombol Filter: Gradient Teal-Blue (Identitas Kita) */}
          <button className="bg-gradient-to-r from-[#0D9488] to-[#1E40AF] text-white px-8 py-4 rounded-2xl font-black text-xs tracking-[0.2em] shadow-xl shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase">
            <i className="fas fa-filter text-xs"></i> Filter data
          </button>
        </div>
      </div>

      {/* 📦 Data Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Tanggal</th>
                <th className="px-8 py-6">Barang</th>
                <th className="px-8 py-6 text-center">Tipe</th>
                <th className="px-8 py-6 text-center">Jumlah</th>
                <th className="px-8 py-6 text-left">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mutations.map((m, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-5">
                    <p className="font-semibold text-slate-800 text-sm mb-0.5">{m.tanggal}</p>
                    <p className="font-medium text-slate-400 text-[11px]">{m.waktu}</p>
                  </td>

                  {/* Nama Barang: Normal Case (Hanya awal kata besar) & Muted Navy */}
                  <td className="px-8 py-5 text-left">
                    <p className="font-semibold text-[#334155] text-sm tracking-tight leading-tight">
                      {m.barang}
                    </p>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest ${
                      m.tipe === 'IN' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-400'
                    }`}>
                      {m.tipe}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-center font-bold text-slate-700 text-sm">
                    {m.jumlah}
                  </td>

                  <td className="px-8 py-5">
                    <span className="text-slate-400 font-medium text-xs italic">
                      {m.ket ? `"${m.ket}"` : '""'}
                    </span>
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

export default Riwayat;