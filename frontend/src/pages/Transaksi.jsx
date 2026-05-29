import React, { useState, useEffect } from 'react';

const Transaksi = () => {
  const [barangList, setBarangList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk kontrol input manual supplier baru
  const [isManualSupplier, setIsManualSupplier] = useState(false);

  const [formData, setFormData] = useState({
    barang_id: '',
    jenis_mutasi: 'Masuk',
    jumlah: '',
    supplier_id: '',
    keterangan: '',
    // Sub-object untuk data supplier baru jika input manual
    new_supplier_name: '',
    new_supplier_contact: '',
    new_supplier_address: ''
  });

  // 1. Load Data Barang & Supplier dari backend
  useEffect(() => {
    const fetchRequiredData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const resBarang = await fetch('http://localhost:5000/api/barang', { method: 'GET', headers });
        const dataBarang = await resBarang.json();
        setBarangList(Array.isArray(dataBarang) ? dataBarang : dataBarang.data || []);

        const resSupplier = await fetch('http://localhost:5000/api/supplier', { method: 'GET', headers });
        const dataSupplier = await resSupplier.json();
        setSupplierList(Array.isArray(dataSupplier) ? dataSupplier : dataSupplier.data || []);

      } catch (err) {
        console.error("[FETCH TRANSAKSI REQUIREMENT ERROR]:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequiredData();
  }, []);

  // 2. Handler submit form mutasi
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.barang_id || !formData.jumlah) {
      alert("Harap isi Produk dan Kuantitas barang!");
      return;
    }

    // Validasi kondisional untuk Supplier (Hanya jika Stock In)
    if (formData.jenis_mutasi === 'Masuk') {
      if (isManualSupplier && !formData.new_supplier_name) {
        alert("Nama Supplier baru wajib diisi!");
        return;
      }
      if (!isManualSupplier && !formData.supplier_id) {
        alert("Harap pilih salah satu Supplier yang tersedia!");
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      
      // --- LANGKAH OPTIONAL: Jika user mengisi supplier baru secara manual ---
      let finalSupplierId = formData.supplier_id;
      
      if (formData.jenis_mutasi === 'Masuk' && isManualSupplier) {
        // Daftarkan supplier baru ke database terlebih dahulu via API eksklusif supplier kita
        const resNewSup = await fetch('http://localhost:5000/api/supplier', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            nama_supplier: formData.new_supplier_name,
            kontak: formData.new_supplier_contact,
            alamat: formData.new_supplier_address
          })
        });
        
        const dataNewSup = await resNewSup.json();
        if (!resNewSup.ok) throw new Error(dataNewSup.message || "Gagal mendaftarkan supplier baru secara otomatis");
        
        // Ambil ID yang baru saja dibuat
        finalSupplierId = dataNewSup.insertId || dataNewSup.data?.id_supplier;
      }

      // --- LANGKAH UTAMA: Simpan transaksi mutasi stok ---
      const response = await fetch('http://localhost:5000/api/transaksi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          barang_id: parseInt(formData.barang_id),
          jenis_mutasi: formData.jenis_mutasi,
          jumlah: parseInt(formData.jumlah),
          supplier_id: formData.jenis_mutasi === 'Masuk' ? parseInt(finalSupplierId) : null,
          keterangan: formData.keterangan
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Gagal menyimpan mutasi stok");

      alert(`Sukses: ${result.message || "Mutasi Stok Berhasil Dicatat!"}`);
      window.location.reload();

    } catch (err) {
      alert(`⚠️ Error: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans gap-3">
        <div className="w-12 h-12 border-[3.5px] border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 animate-pulse">Preparing Intelligent Form...</p>
      </div>
    );
  }

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
                  value={formData.barang_id}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer font-bold text-slate-700"
                  onChange={(e) => setFormData({...formData, barang_id: e.target.value})}
                >
                  <option value="">-- Pilih Barang di Gudang --</option>
                  {barangList.map((barang) => (
                    <option key={barang.id_barang} value={barang.id_barang}>
                      {barang.nama} (STOK TERKINI: {barang.stok})
                    </option>
                  ))}
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
                    className={`flex-1 py-4 rounded-2xl font-black text-xs tracking-widest transition-all ${formData.jenis_mutasi === 'Keluar' ? 'bg-red-50 text-white shadow-lg shadow-red-500/30' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                  >
                    STOCK OUT
                  </button>
                </div>
              </div>
            </div>

            {/* AREA MANAJEMEN SUPPLIER (Hanya Tampil Jika Mutasi Masuk) */}
            {formData.jenis_mutasi === 'Masuk' && (
              <div className="space-y-4 p-6 bg-slate-50/50 rounded-3xl border border-slate-100/80 animate-fadeIn">
                
                {/* 🔥 TEKS PETUNJUK INFORMATIF WAJIB */}
                <div className="p-4 bg-blue-50/60 border border-blue-100/80 rounded-2xl flex gap-3 text-left">
                  <span className="text-blue-600 mt-0.5"><i className="fas fa-circle-info text-sm"></i></span>
                  <div className="space-y-0.5">
                    <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Informasi Pemasokan</h5>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Silakan cari asal distributor pada pilihan di bawah. Jika nama perusahaan <span className="text-blue-600 font-bold">tidak ada dalam pilihan</span>, Anda <span className="text-red-500 font-bold">wajib</span> mencentang opsi buat manual di bawah untuk mendaftarkan data supplier baru secara lengkap.
                    </p>
                  </div>
                </div>

                {/* Checkbox Toggle Pengalihan Input */}
                <div className="flex items-center gap-3 ml-1 pt-1">
                  <input 
                    type="checkbox" 
                    id="manualSupplierCheck"
                    checked={isManualSupplier}
                    onChange={(e) => setIsManualSupplier(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/30 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="manualSupplierCheck" className="text-xs font-bold text-slate-600 cursor-pointer select-none">
                    Tambah Supplier Baru Secara Manual <span className="text-red-500 font-black">*</span>
                  </label>
                </div>

                {/* KONDISI A: Pilih dari Dropdown Database */}
                {!isManualSupplier ? (
                  <div className="space-y-2 animate-fadeIn">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Asal Mitra Supplier <span className="text-red-500">*</span></label>
                    <select 
                      value={formData.supplier_id}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer font-bold text-slate-700 shadow-sm"
                      onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
                    >
                      <option value="">-- Pilih Supplier Penyedia Barang --</option>
                      {supplierList.map((sup) => (
                        <option key={sup.id_supplier} value={sup.id_supplier}>
                          {sup.nama_supplier} {sup.kontak ? `(${sup.kontak})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  /* KONDISI B: Form Isi Baru Lengkap */
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nama Supplier Baru <span className="text-red-500">*</span></label>
                        <input 
                          type="text"
                          placeholder="Nama Perusahaan / Distributor (Wajib)"
                          className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-semibold text-slate-700 shadow-sm text-sm"
                          onChange={(e) => setFormData({...formData, new_supplier_name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nomor Kontak / Telepon</label>
                        <input 
                          type="text"
                          placeholder="021-xxxxxx atau 08xxxxxx (Opsional)"
                          className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-semibold text-slate-700 shadow-sm text-sm"
                          onChange={(e) => setFormData({...formData, new_supplier_contact: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Alamat Kantor Supplier</label>
                      <input 
                        type="text"
                        placeholder="Nama jalan, Gedung, Kota lokasi supplier... (Opsional)"
                        className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-semibold text-slate-700 shadow-sm text-sm"
                        onChange={(e) => setFormData({...formData, new_supplier_address: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* JUMLAH STOK */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Kuantitas Barang</label>
              <div className="relative">
                <input 
                  type="number"
                  placeholder="0"
                  value={formData.jumlah}
                  min="1"
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
                value={formData.keterangan}
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