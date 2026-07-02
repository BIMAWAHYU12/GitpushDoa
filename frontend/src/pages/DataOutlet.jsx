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
  // Cek apakah user yang login adalah admin
  const isAdmin = localStorage.getItem('user_role') === 'admin';

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
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans gap-3 bg-[#F6F6F2]">
        <div className="w-12 h-12 border-[3.5px] border-[#388087] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#388087] animate-pulse">Loading Terminal Nodes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 text-rose-600 rounded-3xl text-sm font-bold text-center max-w-md mx-auto mt-20 shadow-sm">
        ⚠️ Error: {error}
      </div>
    );
  }

  return (
    // 🔥 FOUNDATION BACKGROUND: Menggunakan warna murni Cream Satin (#F6F6F2) & Teks Deep Teal (#388087)
    <div className="w-full space-y-6 animate-fadeIn text-left font-sans bg-[#F6F6F2] min-h-screen pt-2 px-1 text-[#388087]">
      
      {/* 🚀 HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-[#388087]">
            Jaringan Node Outlet
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Kelola jaringan distribusi node dan lokasi outlet iGUDANG resmi.
          </p>
        </div>
      </div>

      {/* 🔍 SEARCH & ACTION BAR */}
      <div className="flex flex-col md:flex-row items-center gap-4 px-1">
        <div className="relative flex-1 w-full">
          {/* Input pencarian tetap putih bersih kontras */}
          <input 
            type="text" 
            placeholder="Cari outlet berdasarkan nama atau wilayah..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-12 py-3.5 bg-white border border-[#BADFE7] rounded-2xl text-sm font-medium text-slate-700 placeholder-slate-400 outline-none focus:border-[#388087] transition-all shadow-sm" 
          />
          <i className="fas fa-search absolute right-5 top-1/2 -translate-y-1/2 text-[#388087]/50"></i>
        </div>
        {/* Tombol Tambah Outlet hanya dirender jika user adalah admin */}
        {isAdmin && (
          <button 
            onClick={handleOpenCreate}
            // 🔥 ACTION BUTTON: Menggunakan warna utama Deep Teal (#388087)
            className="w-full md:w-auto bg-[#388087] hover:bg-[#2a636b] text-white px-8 py-3.5 rounded-2xl font-black text-[11px] tracking-widest shadow-md shadow-[#388087]/10 active:scale-[0.98] transition-all uppercase whitespace-nowrap"
          >
            + Tambah Outlet
          </button>
        )}
      </div>

      {/* 📦 TABLE CONTAINER (KOTAK TABEL TETAP PUTIH BERSIH ELEGAN KONTRAS DI ATAS CREAM) */}
      <div className="bg-white rounded-[32px] shadow-[0_4px_25px_rgba(56,128,135,0.02)] border border-[#BADFE7]/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]"> 
            <thead className="bg-[#BADFE7]/20 border-b border-[#BADFE7]/40">
              <tr className="text-[10px] font-black text-[#388087]/60 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Informasi Jaringan Outlet</th>
                <th className="px-8 py-6">Klasifikasi Cabang</th>
                <th className="px-8 py-6 text-center">Wilayah / Alamat</th>
                <th className="px-8 py-6 text-center">Kontak Cabang</th>
                {/* Kolom Aksi hanya dirender jika user adalah admin */}
                {isAdmin && <th className="px-8 py-6 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-left bg-white">
              {filteredOutlet.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? "5" : "4"} className="px-8 py-12 text-center text-slate-400 font-bold text-xs">Tidak ada jaringan outlet yang terdaftar.</td>
                </tr>
              ) : (
                filteredOutlet.map((item) => {
                  const imageUrl = item.gambar ? `http://localhost:5000/uploads/${item.gambar}` : null;
                  
                  return (
                    <tr key={item.id_outlet} className="hover:bg-[#BADFE7]/10 transition-all group">
                      
                      {/* INFORMASI OUTLET + GAMBAR ASSET */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-14 h-14 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0 shadow-sm flex items-center justify-center">
                            {imageUrl ? (
                              <img src={imageUrl} alt="" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
                            ) : (
                              <i className="fas fa-store text-[#388087]/40 text-xl"></i>
                            )}
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-slate-800 text-sm tracking-tight leading-tight mb-1 uppercase">
                              {item.nama_outlet}
                            </p>
                            <span className="text-[10px] font-black text-slate-400 tracking-wider">
                              ID CABANG: #{item.id_outlet}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CLASSIFICATION NODE */}
                      <td className="px-8 py-5">
                        <span className="inline-block whitespace-nowrap bg-[#BADFE7]/40 text-[#388087] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-[#BADFE7]/10">
                          Store / Cabang
                        </span>
                      </td>

                      {/* WILAYAH / ALAMAT */}
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 font-bold text-[11px]">
                          <i className="fas fa-location-dot text-[10px] text-slate-400"></i> 
                          {item.alamat}
                        </div>
                      </td>

                      {/* KONTAK OUTLET */}
                      <td className="px-8 py-5 text-center">
                        <p className="font-black text-slate-700 text-sm leading-none tracking-tight">
                          {item.kontak || '-'}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase mt-1.5 tracking-tight italic">
                          Operational Hotline
                        </p>
                      </td>

                      {/* AKSI BUTTONS hanya dirender jika user adalah admin */}
                      {isAdmin && (
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2.5">
                            <button 
                              onClick={() => handleOpenEdit(item)}
                              className="w-9 h-9 rounded-xl bg-slate-50 text-slate-700 hover:bg-[#6FB3B8] hover:text-white transition-all shadow-sm flex items-center justify-center border border-slate-200/60"
                            >
                              <i className="fas fa-pen text-xs"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(item.id_outlet)}
                              className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center border border-slate-200/60"
                            >
                              <i className="fas fa-trash text-xs"></i>
                            </button>
                          </div>
                        </td>
                      )}

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 🛠️ MODAL BOX DIALOG: FORM TAMBAH & EDIT MASTER OUTLET ─── */}
      {/* Form hanya dirender jika state modal aktif dan user adalah admin */}
      {showFormModal && isAdmin && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] border border-[#BADFE7]/40 shadow-2xl w-full max-w-lg p-6 md:p-8 animate-scaleUp text-left" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-base font-black text-[#388087] uppercase tracking-wider">
                {isEditMode ? '📝 Edit Data Node Outlet' : '🏢 Daftarkan Outlet Baru'}
              </h3>
              <button onClick={() => setShowFormModal(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700">
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-5">
              {/* Nama Outlet */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Nama Jaringan Outlet</label>
                <input 
                  type="text"
                  placeholder="Contoh: iGUDANG Cabang Surabaya"
                  value={formData.nama_outlet}
                  onChange={(e) => setFormData({ ...formData, nama_outlet: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#388087]"
                />
              </div>

              {/* Grid: Alamat & Kontak */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Wilayah / Alamat</label>
                  <input 
                    type="text"
                    placeholder="Contoh: Surabaya, Jawa Timur"
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#388087]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Kontak / No. Telepon</label>
                  <input 
                    type="text"
                    placeholder="Contoh: 08123456789"
                    value={formData.kontak}
                    onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#388087]"
                  />
                </div>
              </div>

              {/* Upload Gambar Profil/Asset Outlet */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Upload Foto Profil Outlet Node</label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer"
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-[#388087] hover:bg-[#2a636b] text-white rounded-xl font-black text-xs tracking-widest uppercase shadow-md shadow-[#388087]/10 active:scale-[0.98] transition-all">
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