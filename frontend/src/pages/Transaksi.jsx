import React, { useState, useEffect } from 'react';

const Transaksi = () => {
  const [barangList, setBarangList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [outletList, setOutletList] = useState([]); 
  const [kategoriList, setKategoriList] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk kontrol input manual supplier baru (Stock In)
  const [isManualSupplier, setIsManualSupplier] = useState(false);

  // 🛠️ State Kontrol Modal Katalog Barang
  const [showKatalogModal, setShowKatalogModal] = useState(false);
  const [searchBarang, setSearchBarang] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedBarangName, setSelectedBarangName] = useState(''); 

  // 🏢 State Kontrol Modal Jaringan Outlet (Stock Out)
  const [showOutletModal, setShowOutletModal] = useState(false);
  const [searchOutlet, setSearchOutlet] = useState('');
  const [selectedOutletData, setSelectedOutletData] = useState(null); 

  const [formData, setFormData] = useState({
    barang_id: '',
    jenis_mutasi: 'Masuk',
    jumlah: '',
    supplier_id: '',
    outlet_id: '', 
    keterangan: '',
    new_supplier_name: '',
    new_supplier_contact: '',
    new_supplier_address: ''
  });

  // Load Data dari backend iGUDANG
  useEffect(() => {
    const fetchRequiredData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        // Fetch Barang
        const resBarang = await fetch('http://localhost:5000/api/barang', { method: 'GET', headers });
        const dataBarang = await resBarang.json();
        setBarangList(Array.isArray(dataBarang) ? dataBarang : dataBarang.data || []);

        // Fetch Supplier
        const resSupplier = await fetch('http://localhost:5000/api/supplier', { method: 'GET', headers });
        const dataSupplier = await resSupplier.json();
        setSupplierList(Array.isArray(dataSupplier) ? dataSupplier : dataSupplier.data || []);

        // Fetch Jaringan Outlet
        const resOutlet = await fetch('http://localhost:5000/api/outlet', { method: 'GET', headers });
        const dataOutlet = await resOutlet.json();
        setOutletList(Array.isArray(dataOutlet) ? dataOutlet : dataOutlet.data || []);

        // Fetch Dashboard/Kategori untuk list filter katalog
        const resDashboard = await fetch('http://localhost:5000/api/dashboard', { method: 'GET', headers });
        const dataDashboard = await resDashboard.json();
        setKategoriList(dataDashboard.data?.kategori_list || []);

      } catch (err) {
        console.error("[FETCH TRANSAKSI REQUIREMENT ERROR]:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequiredData();
  }, []);

  // Handler perpindahan jenis mutasi agar state bersih
  const handleJenisMutasiChange = (tipe) => {
    setFormData(prev => ({
      ...prev,
      jenis_mutasi: tipe,
      supplier_id: '',
      outlet_id: '',
      new_supplier_name: '',
      new_supplier_contact: '',
      new_supplier_address: ''
    }));
    setIsManualSupplier(false);
    setSelectedOutletData(null);
  };

  // Handler pilih barang dari Modal Katalog
  const handleSelectBarang = (barang) => {
    setFormData(prev => ({ ...prev, barang_id: barang.id_barang }));
    setSelectedBarangName(`${barang.nama} (Stok: ${barang.stok})`);
    setShowKatalogModal(false); 
  };

  // Handler pilih outlet dari Modal Outlet
  const handleSelectOutlet = (outlet) => {
    setFormData(prev => ({ ...prev, outlet_id: outlet.id_outlet }));
    setSelectedOutletData(outlet);
    setShowOutletModal(false);
  };

  // Filter pencarian & kategori untuk Katalog Barang
  const filteredBarangKatalog = barangList.filter(barang => {
    const matchesSearch = barang.nama?.toLowerCase().includes(searchBarang.toLowerCase()) || 
                          barang.id_barang?.toString().includes(searchBarang);
    const matchesKategori = selectedKategori === '' || barang.kategori_id?.toString() === selectedKategori?.toString();
    return matchesSearch && matchesKategori;
  });

  // Filter pencarian untuk Jaringan Outlet
  const filteredOutletKatalog = outletList.filter(outlet => {
    return outlet.nama_outlet?.toLowerCase().includes(searchOutlet.toLowerCase()) ||
           outlet.alamat?.toLowerCase().includes(searchOutlet.toLowerCase()) ||
           outlet.id_outlet?.toString().includes(searchOutlet);
  });

  // Handler submit form mutasi (Sudah sinkron penuh dengan controller backend lo)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.barang_id) {
      alert("⚠️ Validasi Gagal: Anda belum memilih Produk dari katalog asset!");
      return;
    }

    if (!formData.jumlah || parseInt(formData.jumlah) <= 0) {
      alert("⚠️ Validasi Gagal: Kuantitas barang mutasi wajib diisi dan harus lebih besar dari 0!");
      return;
    }

    if (formData.jenis_mutasi === 'Masuk') {
      if (isManualSupplier && !formData.new_supplier_name) {
        alert("⚠️ Validasi Gagal: Nama Supplier baru wajib diisi!");
        return;
      }
      if (!isManualSupplier && !formData.supplier_id) {
        alert("⚠️ Validasi Gagal: Harap pilih salah satu Supplier yang tersedia!");
        return;
      }
    } else if (formData.jenis_mutasi === 'Keluar') {
      if (!formData.outlet_id) {
        alert("⚠️ Validasi Gagal: Harap pilih Outlet tujuan distribusi barang keluar!");
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      
      // 🕵️‍♂️ Ekstrak id_user secara aman dari JWT Token di LocalStorage
      let idUserFromToken = null;
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const decoded = JSON.parse(jsonPayload);
          idUserFromToken = decoded.id_user || decoded.id; 
        } catch (jwtErr) {
          console.error("Gagal mendecode token login:", jwtErr.message);
        }
      }

      if (!idUserFromToken) {
        alert("⚠️ Sesi masuk tidak valid, silakan login ulang!");
        return;
      }

      let finalSupplierId = formData.supplier_id;
      
      // Jika mendaftarkan supplier baru secara manual saat Stock In
      if (formData.jenis_mutasi === 'Masuk' && isManualSupplier) {
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
        if (!resNewSup.ok) throw new Error(dataNewSup.message || "Gagal mendaftarkan supplier baru");
        
        finalSupplierId = dataNewSup.insertId || dataNewSup.data?.id_supplier;
      }

      // 🛠️ MENYELARASKAN DENGAN PARAMETER REQ.BODY BACKEND LO
      const payloadBackend = {
        id_barang: parseInt(formData.barang_id),
        tipe: formData.jenis_mutasi === 'Masuk' ? 'IN' : 'OUT', 
        jumlah: parseInt(formData.jumlah),
        keterangan: formData.keterangan || null,
        id_user: parseInt(idUserFromToken), 
        id_supplier: formData.jenis_mutasi === 'Masuk' ? parseInt(finalSupplierId) : null,
        id_outlet: formData.jenis_mutasi === 'Keluar' ? parseInt(formData.outlet_id) : null
      };

      const response = await fetch('http://localhost:5000/api/transaksi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payloadBackend)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || result.message || "Gagal menyimpan mutasi stok");
      }

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
    <div className="max-w-4xl mx-auto text-left">
      {/* HEADER HALAMAN */}
      <div className="mb-8 px-1">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Form Mutasi Stok</h1>
        <p className="text-slate-500 font-medium mt-1 text-sm uppercase tracking-widest">Recording Digital Inventory Flow</p>
      </div>

      {/* CARD FORM */}
      <div className="bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        <div className="p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* GRID 1: PILIH PRODUK & TIPE MUTASI (SIMETRIS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* PILIH BARANG VIA MODAL */}
              <div className="space-y-3 flex flex-col justify-between">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Pilih Produk <span className="text-red-500">*</span></label>
                <div 
                  onClick={() => setShowKatalogModal(true)}
                  className="w-full h-[58px] px-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all shadow-inner group"
                >
                  <span className={`font-bold text-sm ${selectedBarangName ? 'text-slate-800' : 'text-slate-400'}`}>
                    {selectedBarangName || '-- Buka Katalog Barang --'}
                  </span>
                  <i className="fas fa-box-open text-slate-300 group-hover:text-emerald-500 transition-colors"></i>
                </div>
              </div>

              {/* JENIS MUTASI */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tipe Mutasi</label>
                <div className="flex gap-4 h-[58px]">
                  <button 
                    type="button"
                    onClick={() => handleJenisMutasiChange('Masuk')}
                    className={`flex-1 rounded-2xl font-black text-xs tracking-widest transition-all ${formData.jenis_mutasi === 'Masuk' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-slate-200'}`}
                  >
                    STOCK IN
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleJenisMutasiChange('Keluar')}
                    className={`flex-1 rounded-2xl font-black text-xs tracking-widest transition-all ${formData.jenis_mutasi === 'Keluar' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-slate-200'}`}
                  >
                    STOCK OUT
                  </button>
                </div>
              </div>
            </div>

            {/* AREA MUTASI MASUK (STOCK IN) */}
            {formData.jenis_mutasi === 'Masuk' && (
              <div className="space-y-5 p-6 bg-slate-50/50 rounded-3xl border border-slate-100/80 animate-fadeIn">
                <div className="p-4 bg-blue-50/60 border border-blue-100/80 rounded-2xl flex gap-3 text-left">
                  <span className="text-blue-600 mt-0.5"><i className="fas fa-circle-info text-sm"></i></span>
                  <div className="space-y-0.5">
                    <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Informasi Pemasokan</h5>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Silakan cari asal distributor pada pilihan di bawah. Jika nama perusahaan <span className="text-blue-600 font-bold">tidak ada dalam pilihan</span>, Anda <span className="text-red-500 font-bold">wajib</span> mencentang opsi buat manual di bawah untuk mendaftarkan data supplier baru secara lengkap.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-1 pt-1">
                  <input 
                    type="checkbox" 
                    id="manualSupplierCheck"
                    checked={isManualSupplier}
                    onChange={(e) => {
                      setIsManualSupplier(e.target.checked);
                      setFormData(prev => ({ ...prev, supplier_id: '', new_supplier_name: '', new_supplier_contact: '', new_supplier_address: '' }));
                    }}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/30 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="manualSupplierCheck" className="text-xs font-bold text-slate-600 cursor-pointer select-none">
                    Tambah Supplier Baru Secara Manual <span className="text-red-500 font-black">*</span>
                  </label>
                </div>

                {!isManualSupplier ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Asal Mitra Supplier <span className="text-red-500">*</span></label>
                    <select 
                      value={formData.supplier_id}
                      className="w-full px-5 h-[54px] bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer font-bold text-slate-700 shadow-sm"
                      onChange={(e) => setFormData(prev => ({...prev, supplier_id: e.target.value}))}
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
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nama Supplier Baru <span className="text-red-500">*</span></label>
                        <input 
                          type="text"
                          placeholder="Nama Perusahaan / Distributor (Wajib)"
                          value={formData.new_supplier_name}
                          className="w-full px-5 h-[50px] bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-semibold text-slate-700 shadow-sm text-sm"
                          onChange={(e) => setFormData(prev => ({...prev, new_supplier_name: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nomor Kontak / Telepon</label>
                        <input 
                          type="text"
                          placeholder="021-xxxxxx atau 08xxxxxx (Opsional)"
                          value={formData.new_supplier_contact}
                          className="w-full px-5 h-[50px] bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-semibold text-slate-700 shadow-sm text-sm"
                          onChange={(e) => setFormData(prev => ({...prev, new_supplier_contact: e.target.value}))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Alamat Kantor Supplier</label>
                      <input 
                        type="text"
                        placeholder="Nama jalan, Gedung, Kota lokasi supplier... (Opsional)"
                        value={formData.new_supplier_address}
                        className="w-full px-5 h-[50px] bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-semibold text-slate-700 shadow-sm text-sm"
                        onChange={(e) => setFormData(prev => ({...prev, new_supplier_address: e.target.value}))}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AREA MUTASI KELUAR (STOCK OUT) */}
            {formData.jenis_mutasi === 'Keluar' && (
              <div className="space-y-5 p-6 bg-slate-50/50 rounded-3xl border border-slate-100/80 animate-fadeIn">
                <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl flex gap-3 text-left">
                  <span className="text-amber-600 mt-0.5"><i className="fas fa-triangle-exclamation text-sm"></i></span>
                  <div className="space-y-0.5">
                    <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Tujuan Distribusi Jaringan</h5>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Silakan pilih target cabang node outlet resmi di bawah ini. Jika nama toko/cabang <span className="text-amber-700 font-bold">tidak tersedia atau belum terdaftar</span>, mohon segera <span className="text-blue-600 font-bold">Hubungi Admin Utama</span> untuk meregistrasikan unit outlet baru pada modul Data Outlet.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tujuan Node Outlet <span className="text-red-500">*</span></label>
                  <div 
                    onClick={() => setShowOutletModal(true)}
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all shadow-sm group"
                  >
                    {selectedOutletData ? (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0 flex items-center justify-center">
                          {selectedOutletData.gambar ? (
                            <img src={`http://localhost:5000/uploads/${selectedOutletData.gambar}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <i className="fas fa-store text-emerald-500 text-lg"></i>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm leading-tight">{selectedOutletData.nama_outlet}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                            <i className="fas fa-location-dot text-slate-300 mr-1"></i>{selectedOutletData.alamat || 'Lokasi tidak tertera'} 
                            <span className="mx-2 text-slate-300">•</span>
                            <i className="fas fa-phone text-slate-300 mr-1"></i>{selectedOutletData.kontak || '-'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 py-2 px-1">
                        <i className="fas fa-store text-slate-300"></i>
                        <span className="font-bold text-sm text-slate-400">-- Klik untuk Cari & Pilih Outlet Tujuan --</span>
                      </div>
                    )}
                    <i className="fas fa-chevron-right text-slate-300 group-hover:text-emerald-500 transition-colors text-xs mr-1"></i>
                  </div>
                </div>
              </div>
            )}

            {/* KUANTITAS */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Kuantitas Barang <span className="text-red-500">*</span></label>
              <div className="relative h-[58px]">
                <input 
                  type="number"
                  placeholder="0"
                  value={formData.jumlah}
                  min="1"
                  className="w-full h-full px-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-black text-2xl text-emerald-600 shadow-inner"
                  onChange={(e) => setFormData(prev => ({...prev, jumlah: e.target.value}))}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xs tracking-widest">UNIT</span>
              </div>
            </div>

            {/* CATATAN */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Alasan / Catatan</label>
              <textarea 
                rows="3"
                value={formData.keterangan}
                placeholder="Contoh: Barang keluar untuk supply cabang regional atau retur produk cacat..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700 shadow-inner"
                onChange={(e) => setFormData(prev => ({...prev, keterangan: e.target.value}))}
              ></textarea>
            </div>

            {/* ACTION BUTTON */}
            <button 
              type="submit"
              className="w-full h-[58px] bg-gradient-to-r from-[#0D9488] to-[#1E40AF] text-white rounded-2xl font-black text-[12px] tracking-[0.3em] shadow-xl shadow-blue-900/20 active:scale-[0.99] transition-all uppercase"
            >
              Simpan Mutasi Digital
            </button>
          </form>
        </div>
      </div>

      {/* MODAL: KATALOG BARANG */}
      {showKatalogModal && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl w-full max-w-2xl p-6 md:p-8 text-left animate-scaleUp" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">📦 Katalog Asset Gudang</h3>
                <p className="text-[11px] font-medium text-slate-400">Pilih salah satu item produk di bawah ini untuk mutasi stok.</p>
              </div>
              <button onClick={() => setShowKatalogModal(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700">
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="relative sm:col-span-2">
                <input 
                  type="text"
                  placeholder="Cari berdasarkan nama produk atau ID..."
                  value={searchBarang}
                  onChange={(e) => setSearchBarang(e.target.value)}
                  className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                />
                <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs"></i>
              </div>
              <div>
                <select
                  value={selectedKategori}
                  onChange={(e) => setSelectedKategori(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Semua Kategori</option>
                  {kategoriList.map(kat => (
                    <option key={kat.id_kategori || kat.kategori_id} value={kat.id_kategori || kat.kategori_id}>
                      {kat.nama_kategori || `ID: ${kat.kategori_id}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="max-h-[350px] overflow-y-auto pr-1 space-y-2.5">
              {filteredBarangKatalog.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-bold text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  Tidak ada data asset barang yang cocok dengan pencarian.
                </div>
              ) : (
                filteredBarangKatalog.map((barang) => (
                  <div 
                    key={barang.id_barang}
                    onClick={() => handleSelectBarang(barang)}
                    className="flex items-center justify-between p-4 bg-white border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/10 rounded-2xl cursor-pointer transition-all shadow-sm group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 flex items-center justify-center">
                        {barang.gambar ? <img src={`http://localhost:5000/uploads/${barang.gambar}`} alt="" className="w-full h-full object-cover" /> : <i className="fas fa-image text-slate-300 text-sm"></i>}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1 group-hover:text-emerald-600">{barang.nama}</h4>
                        <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">ID: #{barang.id_barang}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1.5 rounded-xl text-[11px] font-black bg-emerald-50 text-emerald-600">{barang.stok} UNIT</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: JARINGAN OUTLET */}
      {showOutletModal && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl w-full max-w-2xl p-6 md:p-8 animate-scaleUp" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">🏢 Jaringan Node Outlet</h3>
                <p className="text-[11px] font-medium text-slate-400">Pilih cabang toko target distribusi barang keluar.</p>
              </div>
              <button onClick={() => setShowOutletModal(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700">
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>
            <div className="relative mb-6">
              <input 
                type="text"
                placeholder="Cari berdasarkan nama outlet, alamat, atau ID cabang..."
                value={searchOutlet}
                onChange={(e) => setSearchOutlet(e.target.value)}
                className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
              />
              <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs"></i>
            </div>
            <div className="max-h-[350px] overflow-y-auto pr-1 space-y-2.5">
              {filteredOutletKatalog.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-bold text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  Tidak ada jaringan cabang outlet yang cocok dengan pencarian.
                </div>
              ) : (
                filteredOutletKatalog.map((outlet) => (
                  <div 
                    key={outlet.id_outlet}
                    onClick={() => handleSelectOutlet(outlet)}
                    className="flex items-center justify-between p-4 bg-white border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/10 rounded-2xl cursor-pointer transition-all shadow-sm group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 flex items-center justify-center">
                        {outlet.gambar ? <img src={`http://localhost:5000/uploads/${outlet.gambar}`} alt="" className="w-full h-full object-cover" /> : <i className="fas fa-store text-slate-400 text-lg group-hover:text-emerald-500"></i>}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1 group-hover:text-emerald-600">{outlet.nama_outlet}</h4>
                        <p className="text-[11px] text-slate-400 font-medium"><i className="fas fa-location-dot text-slate-300 mr-1"></i>{outlet.alamat || 'Alamat Belum Diisi'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-100">ID: #{outlet.id_outlet}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Transaksi;