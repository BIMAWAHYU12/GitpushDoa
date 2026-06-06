import React, { useState, useEffect } from 'react';

const DataOutlet = () => {
  const [outletData, setOutletData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🛠️ State Kontrol Modal Form (Tambah / Edit) disesuaikan dengan field database baru
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    nama_outlet: '',
    alamat: '',
    kontak: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const token = localStorage.getItem('token');

  // 1. Fetching Data Utama dari Backend
  const fetchOutlet = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/outlet', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Gagal mengambil data outlet');

      const finalData = Array.isArray(result) ? result : result.data || [];
      setOutletData(finalData);
    } catch (err) {
      console.error("[FETCH OUTLET ERROR]:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOutlet();
  }, []);

  // 2. Handler Buka Form Tambah Baru
  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrentId(null);
    setFormData({ nama_outlet: '', alamat: '', kontak: '' });
    setImageFile(null);
    setShowFormModal(true);
  };

  // 3. Handler Buka Form Edit Data
  const handleOpenEdit = (item) => {
    setIsEditMode(true);
    setCurrentId(item.id_outlet);
    setFormData({
      nama_outlet: item.nama_outlet || '',
      alamat: item.alamat || '',
      kontak: item.kontak || ''
    });
    setImageFile(null);
    setShowFormModal(true);
  };

  // 4. Proses Submit Data (INSERT / UPDATE menggunakan FormData untuk file upload Multer)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.nama_outlet || !formData.alamat || !formData.kontak) {
      alert("Harap lengkapi semua kolom form outlet!");
      return;
    }

    const dataPayload = new FormData();
    dataPayload.append('nama_outlet', formData.nama_outlet);
    dataPayload.append('alamat', formData.alamat);
    dataPayload.append('kontak', formData.kontak);
    if (imageFile) {
      dataPayload.append('gambar', imageFile);
    }

    try {
      const apiUrl = isEditMode 
        ? `http://localhost:5000/api/outlet/${currentId}`
        : 'http://localhost:5000/api/outlet';
      
      const response = await fetch(apiUrl, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
          // Content-Type tidak perlu didefinisikan jika menggunakan FormData karena dihandle otomatis browser
        },
        body: dataPayload
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Gagal memproses data outlet");

      alert(isEditMode ? "Data outlet berhasil diperbarui!" : "Outlet baru berhasil ditambahkan!");
      setShowFormModal(false);
      fetchOutlet(); // Reload table
    } catch (err) {
      alert(`⚠️ Error: ${err.message}`);
    }
  };

  // 5. Fungsi Aksi Hapus Jaringan Outlet
  const handleDeleteItem = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus jaringan node outlet ini dari database iGUDANG?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/outlet/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Gagal menghapus outlet");

      alert("Node outlet resmi dihapus dari sistem!");
      fetchOutlet();
    } catch (err) {
      alert(`⚠️ Gagal Hapus: ${err.message}`);
    }
  };

  // Filter pencarian berdasarkan nama outlet atau wilayah alamat
  const filteredOutlet = outletData.filter(item => 
    item.nama_outlet?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.alamat?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <button 
          onClick={handleOpenCreate}
          className="w-full md:w-auto bg-gradient-to-r from-[#0D9488] to-[#1E40AF] text-white px-8 py-3.5 rounded-2xl font-black text-[11px] tracking-widest shadow-lg shadow-teal-500/20 active:scale-95 transition-all uppercase"
        >
          + Tambah Outlet
        </button>
      </div>

      {/* 📦 TABLE CONTAINER */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]"> 
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Informasi Jaringan Outlet</th>
                <th className="px-8 py-6">Tipe Node</th>
                <th className="px-8 py-6 text-center">Wilayah / Alamat</th>
                <th className="px-8 py-6 text-center">Kontak Node</th>
                <th className="px-8 py-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-left">
              {filteredOutlet.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-slate-400 font-bold text-xs">Tidak ada jaringan outlet yang terdaftar.</td>
                </tr>
              ) : (
                filteredOutlet.map((item) => {
                  // Mengambil file gambar statis dari server upload backend
                  const imageUrl = item.gambar ? `http://localhost:5000/uploads/${item.gambar}` : null;
                  
                  return (
                    <tr key={item.id_outlet} className="hover:bg-slate-50/50 transition-all group">
                      
                      {/* INFORMASI OUTLET + GAMBAR ASSET */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 flex-shrink-0 shadow-sm flex items-center justify-center">
                            {imageUrl ? (
                              <img src={imageUrl} alt="" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
                            ) : (
                              <i className="fas fa-shop text-[#0F766E] text-lg transition-transform group-hover:scale-110 duration-300"></i>
                            )}
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

                      {/* WILAYAH / ALAMAT */}
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/50 rounded-xl text-blue-600 font-bold text-[11px]">
                          <i className="fas fa-location-dot text-[10px] opacity-40"></i> 
                          {item.alamat}
                        </div>
                      </td>

                      {/* KONTAK OUTLET */}
                      <td className="px-8 py-5 text-center">
                        <p className="font-black text-slate-700 text-sm leading-none tracking-tight">
                          {item.kontak || '-'}
                        </p>
                        <p className="text-[9px] font-medium text-slate-400 uppercase mt-1.5 tracking-tighter italic">
                          Operational Hotline
                        </p>
                      </td>

                      {/* AKSI BUTTONS */}
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2.5">
                          <button 
                            onClick={() => handleOpenEdit(item)}
                            className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center justify-center border border-emerald-100/50"
                          >
                            <i className="fas fa-pen text-xs"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id_outlet)}
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
      {/* 🛠️ MODAL BOX DIALOG: FORM TAMBAH & EDIT MASTER OUTLET */}
      {/* ========================================================================= */}
      {showFormModal && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl w-full max-w-lg p-6 md:p-8 animate-scaleUp text-left" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide">
                {isEditMode ? '📝 Edit Data Node Outlet' : '🏢 Daftarkan Outlet Baru'}
              </h3>
              <button onClick={() => setShowFormModal(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700">
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-5">
              {/* Nama Outlet */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Jaringan Outlet</label>
                <input 
                  type="text"
                  placeholder="Contoh: iGUDANG Cabang Surabaya"
                  value={formData.nama_outlet}
                  onChange={(e) => setFormData({ ...formData, nama_outlet: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Grid: Alamat & Kontak */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Wilayah / Alamat</label>
                  <input 
                    type="text"
                    placeholder="Contoh: Surabaya, Jawa Timur"
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kontak / No. Telepon</label>
                  <input 
                    type="text"
                    placeholder="Contoh: 08123456789"
                    value={formData.kontak}
                    onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Upload Gambar Profil/Asset Outlet */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Foto Profil Outlet Node</label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer"
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#0D9488] to-[#1E40AF] text-white rounded-xl font-black text-xs tracking-widest uppercase shadow-lg active:scale-[0.98] transition-all">
                  {isEditMode ? 'Simpan Pembaruan Node' : 'Resmikan Node Outlet Baru'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default DataOutlet;