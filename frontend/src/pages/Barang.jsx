import React, { useState, useEffect } from 'react';

const DataBarang = () => {
  const [barangData, setBarangData] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [rakList, setRakList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Kontrol Modal Form (Tambah / Edit)
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    kategori_id: '',
    rak_id: '',
    stok: 0
  });
  const [imageFile, setImageFile] = useState(null);

  // State untuk Kontrol Modal QR Code Preview
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrItem, setQrItem] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };

  // 1. Fetching Data Utama dari Server
  const loadInitialData = async () => {
    try {
      // Ambil Data Barang
      const resBarang = await fetch('http://localhost:5000/api/barang', { method: 'GET', headers });
      const resultBarang = await resBarang.json();
      const finalBarang = Array.isArray(resultBarang) ? resultBarang : resultBarang.data || [];
      setBarangData(finalBarang);

      // Ambil Data Kategori & Rak Pendukung untuk Form Input Dropdown
      const resKat = await fetch('http://localhost:5000/api/dashboard', { method: 'GET', headers });
      const resultKat = await resKat.json();
      // Opsi fallback jika data kategori & rak dilempar dinamis lewat dashboard metrics atau rute master khusus
      setKategoriList(resultKat.data?.kategori_list || []);
      setRakList(resultKat.data?.rak_list || []);

    } catch (err) {
      console.error("[DATA CORE LOADING ERROR]:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // 2. Handler Buka Form Tambah Baru
  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrentId(null);
    setFormData({ nama: '', kategori_id: '', rak_id: '', stok: 0 });
    setImageFile(null);
    setShowFormModal(true);
  };

  // 3. Handler Buka Form Edit Data
  const handleOpenEdit = (item) => {
    setIsEditMode(true);
    setCurrentId(item.id_barang);
    setFormData({
      nama: item.nama || '',
      kategori_id: item.kategori_id || '',
      rak_id: item.rak_id || '',
      stok: item.stok || 0
    });
    setImageFile(null);
    setShowFormModal(true);
  };

  // 4. Proses Submit Data (INSERT / UPDATE menggunakan FormData untuk file upload Multer)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.kategori_id || !formData.rak_id) {
      alert("Harap lengkapi kolom nama, kategori, dan penempatan rak!");
      return;
    }

    const dataPayload = new FormData();
    dataPayload.append('nama', formData.nama);
    dataPayload.append('kategori_id', formData.kategori_id);
    dataPayload.append('rak_id', formData.rak_id);
    dataPayload.append('stok', formData.stok);
    if (imageFile) {
      dataPayload.append('gambar', imageFile);
    }

    try {
      const apiUrl = isEditMode 
        ? `http://localhost:5000/api/barang/${currentId}`
        : 'http://localhost:5000/api/barang';
      
      const response = await fetch(apiUrl, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, // Content-type dihandle otomatis oleh object FormData
        body: dataPayload
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Gagal memproses data produk");

      alert(isEditMode ? "Barang berhasil diperbarui!" : "Barang baru berhasil ditambahkan!");
      setShowFormModal(false);
      loadInitialData(); // Reload table
    } catch (err) {
      alert(`⚠️ Error: ${err.message}`);
    }
  };

  // 5. Fungsi Aksi Hapus Barang
  const handleDeleteItem = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus aset barang ini dari database gudang?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/barang/${id}`, {
        method: 'DELETE',
        headers: { ...headers, 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Gagal menghapus barang");

      alert("Barang resmi dihapus dari sistem!");
      loadInitialData();
    } catch (err) {
      alert(`⚠️ Gagal Hapus: ${err.message}`);
    }
  };

  // 6. Fungsi Pemicu QR Code Pop-up View
  const handleOpenQr = (item) => {
    setQrItem(item);
    setShowQrModal(true);
  };

  // Filter pencarian data di client-side
  const filteredBarang = barangData.filter(item => 
    item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.nama_kategori || '').toLowerCase().includes(searchQuery.toLowerCase())
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
        <button 
          onClick={handleOpenCreate}
          className="w-full md:w-auto bg-gradient-to-r from-[#0D9488] to-[#1E40AF] text-white px-8 py-3.5 rounded-2xl font-black text-[11px] tracking-widest shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all uppercase"
        >
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
                          {item.nama_kategori || `Cat: ${item.kategori_id}`}
                        </span>
                      </td>

                      {/* LOKASI RAK */}
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/50 rounded-xl text-blue-600 font-bold text-[11px]">
                          <i className="fas fa-location-dot text-[10px] opacity-40"></i> 
                          {item.nama_rak || `Rak: ${item.rak_id}`}
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

                      {/* AKSI KONTROL */}
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2.5">
                          {/* Tombol QR Code */}
                          <button 
                            onClick={() => handleOpenQr(item)}
                            className="w-9 h-9 rounded-xl bg-blue-50 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center justify-center border border-blue-100/50"
                          >
                            <i className="fas fa-qrcode text-xs"></i>
                          </button>
                          {/* Tombol Edit */}
                          <button 
                            onClick={() => handleOpenEdit(item)}
                            className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center justify-center border border-emerald-100/50"
                          >
                            <i className="fas fa-pen text-xs"></i>
                          </button>
                          {/* Tombol Hapus */}
                          <button 
                            onClick={() => handleDeleteItem(item.id_barang)}
                            className="w-9 h-9 rounded-xl bg-slate-50 text-slate-300 hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center border border-slate-100"
                          >
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

      {/* ========================================================================= */}
      {/* 🛠️ MODAL BOX DIALOG: FORM TAMBAH & EDIT MASTER BARANG */}
      {/* ========================================================================= */}
      {showFormModal && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl w-full max-w-lg p-6 md:p-8 animate-scaleUp text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide">
                {isEditMode ? '📝 Edit Aset Barang' : '📦 Tambah Barang Baru'}
              </h3>
              <button onClick={() => setShowFormModal(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700">
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-5">
              {/* Nama Barang */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Produk</label>
                <input 
                  type="text"
                  placeholder="Contoh: MacBook Pro M3"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Grid: Kategori & Lokasi Rak */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                  <select
                    value={formData.kategori_id}
                    onChange={(e) => setFormData({ ...formData, kategori_id: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Pilih --</option>
                    {/* Mengisi opsi kategori statis jika rute master dashboard belum ditarik terpisah */}
                    <option value="1">SMARTPHONE</option>
                    <option value="2">LAPTOP</option>
                    <option value="3">AKSESORIS</option>
                    <option value="4">TELEVISI</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Penempatan Rak</label>
                  <select
                    value={formData.rak_id}
                    onChange={(e) => setFormData({ ...formData, rak_id: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Pilih --</option>
                    <option value="1">A1-R01</option>
                    <option value="2">B1-R02</option>
                    <option value="3">C1-R03</option>
                  </select>
                </div>
              </div>

              {/* Kuantitas Awal & File Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kuantitas</label>
                  <input 
                    type="number"
                    min="0"
                    value={formData.stok}
                    onChange={(e) => setFormData({ ...formData, stok: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Foto Produk Asset</label>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#0D9488] to-[#1E40AF] text-white rounded-xl font-black text-xs tracking-widest uppercase shadow-lg active:scale-[0.98] transition-all">
                  {isEditMode ? 'Simpan Pembaruan Aset' : 'Daftarkan Barang Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🖨️ 📑 MODAL BOX DIALOG: LIVE PREVIEW QR CODE PERGUDANGAN */}
      {/* ========================================================================= */}
      {showQrModal && qrItem && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl w-full max-w-sm p-6 text-center animate-scaleUp" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <h4 className="text-[10px] font-black text-slate-800 tracking-wider uppercase">iGUDANG Sistem Label QR</h4>
              <button onClick={() => setShowQrModal(false)} className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>

            {/* Kontainer Generator Label QR */}
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl inline-block mx-auto shadow-inner mb-4">
              {/* Menggunakan API publik Google Charts untuk menghasilkan QR Code pergudangan instan */}
              <img 
                src={`https://chart.googleapis.com/chart?chs=180x180&cht=qr&chl=IGUDANG-BARANG-${qrItem.id_barang}-${qrItem.nama}`} 
                alt="QR Code Asset" 
                className="w-44 h-44 object-contain shadow-sm rounded-lg bg-white p-2"
              />
            </div>

            <div className="space-y-1 mb-5">
              <h3 className="font-black text-slate-800 text-sm uppercase truncate px-2">{qrItem.nama}</h3>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest">RAK: {qrItem.nama_rak || qrItem.rak_id} • SKU: {qrItem.id_barang}</p>
            </div>

            <button 
              onClick={() => window.print()}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] tracking-widest rounded-xl uppercase transition-all shadow-md active:scale-95"
            >
              <i className="fas fa-print mr-1.5"></i> Cetak Label QR
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DataBarang;