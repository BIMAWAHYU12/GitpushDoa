import React, { useState } from 'react';

const Transaksi = () => {
  const [formData, setFormData] = useState({
    barang_id: '',
    jenis_mutasi: 'Masuk',
    jumlah: '',
    keterangan: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data Mutasi dikirim:", formData);
    alert("Mutasi Stok Berhasil Dicatat!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* HEADER HALAMAN */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Form Mutasi Stok</h1>
        <p className="text-slate-500 font-medium mt-1 text-sm uppercase tracking-widest">Recording Digital Inventory Flow</p>
      </div>

      {/* CARD FORM: White Glassmorphism */}
      <div className="bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        <div className="p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* PILIH BARANG */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Pilih Produk</label>
                <select 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer font-bold text-slate-700"
                  onChange={(e) => setFormData({...formData, barang_id: e.target.value})}
                >
                  <option value="">-- Pilih Barang di Gudang --</option>
                  <option value="1">MacBook Pro M3 (STOK: 12)</option>
                  <option value="2">Logitech MX Master 3 (STOK: 45)</option>
                </select>
              </div>

              {/* JENIS MUTASI */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tipe Mutasi</label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, jenis_mutasi: 'Masuk'})}
                    className={`flex-1 py-4 rounded-2xl font-black text-xs tracking-widest transition-all ${formData.jenis_mutasi === 'Masuk' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                  >
                    STOCK IN
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, jenis_mutasi: 'Keluar'})}
                    className={`flex-1 py-4 rounded-2xl font-black text-xs tracking-widest transition-all ${formData.jenis_mutasi === 'Keluar' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                  >
                    STOCK OUT
                  </button>
                </div>
              </div>
            </div>

            {/* JUMLAH STOK */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Kuantitas Barang</label>
              <div className="relative">
                <input 
                  type="number"
                  placeholder="0"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-black text-2xl text-emerald-600"
                  onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">UNIT</span>
              </div>
            </div>

            {/* KETERANGAN */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Alasan / Catatan</label>
              <textarea 
                rows="3"
                placeholder="Contoh: Barang masuk dari Supplier A atau Retur pelanggan..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700"
                onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
              ></textarea>
            </div>

            {/* ACTION BUTTON */}
            <button 
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-[#0D9488] to-[#1E40AF] text-white rounded-2xl font-black text-[12px] tracking-[0.3em] shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all uppercase"
            >
              Simpan Mutasi Digital
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Transaksi;