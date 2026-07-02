import React, { useState, useEffect } from 'react';

const Transaksi = () => {
  const [barangList, setBarangList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [outletList, setOutletList] = useState([]); 
  const [kategoriList, setKategoriList] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk input manual supplier baru (Stock In)
  const [isManualSupplier, setIsManualSupplier] = useState(false);

  // 🛠️ State Kontrol Modal Katalog Barang
  const [showKatalogModal, setShowKatalogModal] = useState(false);
  const [searchBarang, setSearchBarang] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  
  // 🛒 STATE KERANJANG & INPUT SEMENTARA
  const [cartItems, setCartItems] = useState([]);
  const [tempBarang, setTempBarang] = useState(null);
  const [tempJumlah, setTempJumlah] = useState('1');

  // 🔥 FOTO BUKTI & SURAT JALAN
  const [buktiFile, setBuktiFile] = useState(null);
  const [showSuratJalan, setShowSuratJalan] = useState(false);

  // 🏢 State Kontrol Modal Jaringan Outlet (Stock Out)
  const [showOutletModal, setShowOutletModal] = useState(false);
  const [searchOutlet, setSearchOutlet] = useState('');
  const [selectedOutletData, setSelectedOutletData] = useState(null); 

  const [formData, setFormData] = useState({
    jenis_mutasi: 'Masuk',
    supplier_id: '',
    outlet_id: '', 
    keterangan: '',
    new_supplier_name: '',
    new_supplier_contact: '',
    new_supplier_address: ''
  });

  // Load Data Master
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
        setKategoriList(dataBarang.kategori_list || []);

        const resSupplier = await fetch('http://localhost:5000/api/supplier', { method: 'GET', headers });
        const dataSupplier = await resSupplier.json();
        setSupplierList(Array.isArray(dataSupplier) ? dataSupplier : dataSupplier.data || []);

        const resOutlet = await fetch('http://localhost:5000/api/outlet', { method: 'GET', headers });
        const dataOutlet = await resOutlet.json();
        setOutletList(Array.isArray(dataOutlet) ? dataOutlet : dataOutlet.data || []);

      } catch (err) {
        console.error("[FETCH ERROR]:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequiredData();
  }, []);

  const handleJenisMutasiChange = (tipe) => {
    setFormData(prev => ({
      ...prev,
      jenis_mutasi: tipe,
      supplier_id: '',
      outlet_id: '',
      new_supplier_name: '',
      new_supplier_contact: '',
      new_supplier_address: '',
      keterangan: ''
    }));
    setIsManualSupplier(false);
    setSelectedOutletData(null);
    setCartItems([]); 
    setTempBarang(null);
    setTempJumlah('1');
    setBuktiFile(null);
  };

  const handleSelectBarang = (barang) => {
    setTempBarang(barang);
    setTempJumlah('1'); 
    setShowKatalogModal(false); 
  };

  const handleAddToCart = () => {
    if (!tempBarang) return alert("Pilih barang terlebih dahulu!");
    const qty = parseInt(tempJumlah);
    if (isNaN(qty) || qty <= 0) return alert("Kuantitas harus lebih dari 0!");

    const existingItemIndex = cartItems.findIndex(item => item.id_barang === tempBarang.id_barang);
    
    if (existingItemIndex >= 0) {
      const newCart = [...cartItems];
      newCart[existingItemIndex].jumlah += qty;
      setCartItems(newCart);
    } else {
      setCartItems([...cartItems, {
        id_barang: tempBarang.id_barang,
        nama: tempBarang.nama,
        stok_saat_ini: tempBarang.stok,
        satuan: tempBarang.satuan || 'Pcs',
        gambar: tempBarang.gambar,
        jumlah: qty
      }]);
    }
    setTempBarang(null);
    setTempJumlah('1');
  };

  const handleRemoveFromCart = (id_barang) => {
    setCartItems(cartItems.filter(item => item.id_barang !== id_barang));
  };

  const handleSelectOutlet = (outlet) => {
    setFormData(prev => ({ ...prev, outlet_id: outlet.id_outlet }));
    setSelectedOutletData(outlet);
    setShowOutletModal(false);
  };

  const handleKuantitasKurang = () => setTempJumlah(prev => String(parseInt(prev) > 1 ? parseInt(prev) - 1 : 1));
  const handleKuantitasTambah = () => setTempJumlah(prev => String((parseInt(prev) || 0) + 1));

  const filteredBarangKatalog = barangList.filter(barang => {
    const matchesSearch = barang.nama?.toLowerCase().includes(searchBarang.toLowerCase()) || 
                          barang.id_barang?.toString().includes(searchBarang);
    const bKatId = barang.kategori_id ? String(barang.kategori_id) : '';
    const sKatId = selectedKategori ? String(selectedKategori) : '';
    return matchesSearch && (selectedKategori === '' || bKatId === sKatId);
  });

  const filteredOutletKatalog = outletList.filter(outlet => {
    return outlet.nama_outlet?.toLowerCase().includes(searchOutlet.toLowerCase()) ||
           outlet.alamat?.toLowerCase().includes(searchOutlet.toLowerCase());
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) return alert("⚠️ Keranjang barang mutasi masih kosong!");

    if (formData.jenis_mutasi === 'Masuk') {
      if (isManualSupplier && !formData.new_supplier_name) return alert("⚠️ Nama Supplier baru wajib diisi!");
      if (!isManualSupplier && !formData.supplier_id) return alert("⚠️ Harap pilih Supplier yang tersedia!");
      if (!buktiFile) return alert("⚠️ Harap Upload Foto Bukti Transaksi (Kwitansi/DO)!");
    } else if (formData.jenis_mutasi === 'Keluar') {
      if (!formData.outlet_id) return alert("⚠️ Harap pilih Outlet tujuan distribusi!");
    } else if (formData.jenis_mutasi === 'Audit') {
      if (!formData.keterangan || formData.keterangan.trim() === '') return alert("⚠️ Alasan/Catatan wajib diisi untuk Audit Barang!");
      if (!buktiFile) return alert("⚠️ Foto Bukti Barang Rusak/Audit Wajib Diupload!");
    }

    try {
      const token = localStorage.getItem('token');
      let idUserFromToken = null;
      if (token) {
        const decoded = JSON.parse(decodeURIComponent(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
        idUserFromToken = decoded.id_user || decoded.id; 
      }
      if (!idUserFromToken) return alert("⚠️ Sesi masuk tidak valid, silakan login ulang!");

      let finalSupplierId = formData.supplier_id;
      if (formData.jenis_mutasi === 'Masuk' && isManualSupplier) {
        const resNewSup = await fetch('http://localhost:5000/api/supplier', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ nama_supplier: formData.new_supplier_name, kontak: formData.new_supplier_contact, alamat: formData.new_supplier_address })
        });
        const dataNewSup = await resNewSup.json();
        if (!resNewSup.ok) throw new Error("Gagal mendaftarkan supplier baru");
        finalSupplierId = dataNewSup.insertId || dataNewSup.data?.id_supplier;
      }

      const payloadData = new FormData();
      payloadData.append('tipe', formData.jenis_mutasi === 'Masuk' ? 'IN' : 'OUT');
      const finalKeterangan = formData.jenis_mutasi === 'Audit' ? `[AUDIT STOK] ${formData.keterangan}` : (formData.keterangan || '');
      payloadData.append('keterangan', finalKeterangan);
      payloadData.append('id_user', idUserFromToken);
      
      if (formData.jenis_mutasi === 'Masuk') payloadData.append('id_supplier', finalSupplierId);
      if (formData.jenis_mutasi === 'Keluar') payloadData.append('id_outlet', formData.outlet_id);
      
      payloadData.append('items', JSON.stringify(cartItems.map(item => ({ id_barang: item.id_barang, jumlah: item.jumlah }))));
      if (buktiFile) payloadData.append('bukti_foto', buktiFile);

      const response = await fetch('http://localhost:5000/api/transaksi/bulk', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, 
        body: payloadData
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || result.message || "Gagal menyimpan mutasi stok");

      if (formData.jenis_mutasi === 'Keluar') {
        setShowSuratJalan(true); 
      } else {
        alert(`✅ Sukses: Transaksi ${formData.jenis_mutasi} berhasil dicatat!`);
        window.location.reload();
      }

    } catch (err) {
      alert(`⚠️ Error: ${err.message}`);
    }
  };

  // 🚀 FUNGSI CETAK ULTIMATE DENGAN IFRAME (Bypass CSS Sidebar)
  const executePrint = () => {
    // Bangun HTML statis untuk print
    let itemsHtml = '';
    cartItems.forEach((item, index) => {
      itemsHtml += `
        <tr>
          <td style="text-align: center;">${index + 1}</td>
          <td>
            <strong>${item.nama}</strong><br/>
            <span style="font-size: 11px; color: #666;">SKU: #${item.id_barang}</span>
          </td>
          <td style="text-align: center; font-weight: bold; font-size: 16px;">
            ${item.jumlah} <span style="font-size: 12px; font-weight: normal;">${item.satuan}</span>
          </td>
        </tr>
      `;
    });

    const printContent = `
      <html>
        <head>
          <title>Surat Jalan - iGUDANG</title>
          <style>
            @page { size: A4 portrait; margin: 20mm; }
            body { font-family: 'Arial', sans-serif; color: #000; margin: 0; padding: 0; }
            .header { border-bottom: 3px solid #000; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; }
            .header-left h1 { font-size: 28px; font-weight: 900; margin: 0 0 5px 0; letter-spacing: -1px; }
            .header-left p { margin: 0; font-size: 12px; color: #555; }
            .header-right { text-align: right; }
            .header-right h2 { font-size: 24px; font-weight: 900; margin: 0 0 5px 0; color: #333; letter-spacing: 2px; }
            .header-right p { margin: 0; font-size: 12px; font-weight: bold; }
            
            .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .info-box { width: 45%; }
            .info-box p.title { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #666; margin: 0 0 5px 0; }
            .info-box h3 { font-size: 16px; font-weight: bold; margin: 0 0 5px 0; }
            .info-box p.desc { font-size: 13px; margin: 0; line-height: 1.4; }
            
            .note-box { width: 40%; border: 1px solid #ccc; padding: 12px; border-radius: 6px; background: #f9f9f9; }
            .note-box p.title { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #666; margin: 0 0 5px 0; }
            .note-box p.desc { font-size: 12px; font-style: italic; margin: 0; }

            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th, td { border: 1px solid #000; padding: 12px; text-align: left; }
            th { background-color: #f0f0f0; font-size: 12px; text-transform: uppercase; }
            
            .signatures { display: flex; justify-content: space-between; margin-top: 50px; text-align: center; }
            .sig-box { width: 30%; }
            .sig-title { font-size: 12px; font-weight: bold; color: #555; margin-bottom: 80px; text-transform: uppercase; }
            .sig-line { border-bottom: 1px solid #000; margin-bottom: 5px; width: 80%; margin-left: auto; margin-right: auto; }
            .sig-name { font-size: 12px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-left">
              <h1>iGUDANG LOGISTICS</h1>
              <p><b>MAIN DISTRIBUTION CENTER</b><br/>Jl. Logistik Sentral No. 99, Jakarta<br/>Hotline: (021) 555-1234</p>
            </div>
            <div class="header-right">
              <h2>SURAT JALAN</h2>
              <p>Tanggal: ${new Date().toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year:'numeric'})}</p>
            </div>
          </div>

          <div class="info-section">
            <div class="info-box">
              <p class="title">Dikirim Kepada (Tujuan):</p>
              <h3>${selectedOutletData?.nama_outlet || '-'}</h3>
              <p class="desc">${selectedOutletData?.alamat || '-'}<br/><b>Telp:</b> ${selectedOutletData?.kontak || '-'}</p>
            </div>
            <div class="note-box">
              <p class="title">Catatan Pengiriman:</p>
              <p class="desc">${formData.keterangan || 'Distribusi reguler, harap periksa kesesuaian kuantitas fisik sebelum menandatangani penerimaan.'}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50px; text-align: center;">No.</th>
                <th>Nama Barang / SKU</th>
                <th style="width: 100px; text-align: center;">Kuantitas</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="signatures">
            <div class="sig-box">
              <p class="sig-title">Admin Gudang (Pengirim)</p>
              <div class="sig-line"></div>
              <p class="sig-name">Nama Jelas & Ttd</p>
            </div>
            <div class="sig-box">
              <p class="sig-title">Pengemudi / Kurir</p>
              <div class="sig-line"></div>
              <p class="sig-name">Nama Jelas & Ttd</p>
            </div>
            <div class="sig-box">
              <p class="sig-title">Penerima Cabang</p>
              <div class="sig-line"></div>
              <p class="sig-name">Cap Toko & Ttd</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Buat iframe rahasia
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(printContent);
    doc.close();

    // Tunggu render, lalu print hanya isi iframe
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      
      // Bersihkan DOM dan reload
      setTimeout(() => {
        document.body.removeChild(iframe);
        window.location.reload();
      }, 500);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans gap-3 bg-[#F6F6F2]">
        <div className="w-12 h-12 border-[3.5px] border-[#388087] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#388087] animate-pulse">Preparing Intelligent Form...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-fadeIn text-left font-sans bg-[#F6F6F2] min-h-screen pt-2 px-1 text-[#388087]">
      
      {/* HEADER HALAMAN */}
      <div className="mb-8 px-1">
        <h1 className="text-3xl font-black tracking-tight text-[#388087]">Form Mutasi Stok</h1>
        <p className="text-slate-500 font-medium mt-1 text-sm uppercase tracking-widest">Recording Digital Inventory Flow</p>
      </div>

      <div className="bg-white rounded-[32px] shadow-[0_4px_25px_rgba(56,128,135,0.02)] border border-[#BADFE7]/60 overflow-hidden">
        <div className="p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* TIPE MUTASI */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tipe Mutasi</label>
              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  type="button"
                  onClick={() => handleJenisMutasiChange('Masuk')}
                  className={`flex-1 h-[58px] rounded-2xl font-black text-xs tracking-widest transition-all ${formData.jenis_mutasi === 'Masuk' ? 'bg-[#388087] text-white shadow-md shadow-[#388087]/10' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-slate-200'}`}
                >
                  STOCK IN
                </button>
                <button 
                  type="button"
                  onClick={() => handleJenisMutasiChange('Keluar')}
                  className={`flex-1 h-[58px] rounded-2xl font-black text-xs tracking-widest transition-all ${formData.jenis_mutasi === 'Keluar' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-slate-200'}`}
                >
                  STOCK OUT
                </button>
                <button 
                  type="button"
                  onClick={() => handleJenisMutasiChange('Audit')}
                  className={`flex-1 h-[58px] rounded-2xl font-black text-xs tracking-widest transition-all ${formData.jenis_mutasi === 'Audit' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/10' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-slate-200'}`}
                >
                  AUDIT / RUSAK
                </button>
              </div>
            </div>

            <hr className="border-slate-100 border-dashed" />

            {/* AREA KERANJANG */}
            <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100/80">
              <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-5">Pilih & Tambah Barang</h5>
              
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:flex-1 space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Cari Produk Asset</label>
                  <div 
                    onClick={() => setShowKatalogModal(true)}
                    className="w-full h-[54px] px-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer hover:border-[#388087]/50 transition-all shadow-sm group"
                  >
                    <span className={`font-bold text-sm ${tempBarang ? 'text-slate-800' : 'text-slate-400'}`}>
                      {tempBarang ? `${tempBarang.nama} (Sisa: ${tempBarang.stok})` : '-- Buka Katalog Barang --'}
                    </span>
                    <i className="fas fa-box-open text-slate-300 group-hover:text-[#388087] transition-colors"></i>
                  </div>
                </div>

                <div className="w-full md:w-48 space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Kuantitas</label>
                  <div className="relative h-[54px]">
                    <input 
                      type="number"
                      value={tempJumlah}
                      min="1"
                      className="w-full h-full px-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-[#388087] font-bold text-slate-800 shadow-sm"
                      onChange={(e) => setTempJumlah(e.target.value)}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-slate-50 pl-2 pr-1 py-1 rounded-xl border border-slate-100">
                      <span className="font-black text-slate-500 text-[9px] tracking-wider uppercase mr-1">{tempBarang?.satuan || 'UNIT'}</span>
                      <button type="button" onClick={handleKuantitasKurang} className="w-6 h-6 rounded bg-white text-slate-600 shadow-sm flex items-center justify-center font-black border border-slate-100">-</button>
                      <button type="button" onClick={handleKuantitasTambah} className="w-6 h-6 rounded bg-[#388087] text-white shadow-sm flex items-center justify-center font-black">+</button>
                    </div>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={handleAddToCart}
                  className="w-full md:w-auto h-[54px] px-8 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black text-[11px] tracking-widest shadow-md active:scale-95 transition-all uppercase"
                >
                  + Tambah
                </button>
              </div>

              {/* TABEL KERANJANG */}
              {cartItems.length > 0 && (
                <div className="mt-6 pt-6 border-t border-dashed border-slate-200">
                  <h6 className="text-[10px] font-black text-[#388087] uppercase tracking-widest mb-3">Daftar Barang Mutasi ({cartItems.length} Item)</h6>
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-5 py-4">Barang</th>
                          <th className="px-5 py-4 text-center">Kuantitas</th>
                          <th className="px-5 py-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {cartItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-5 py-3">
                              <p className="font-bold text-sm text-slate-800">{item.nama}</p>
                              <p className="text-[10px] text-slate-400 font-medium mt-0.5">ID: #{item.id_barang}</p>
                            </td>
                            <td className="px-5 py-3 text-center">
                              <span className="font-black text-[#388087] bg-[#BADFE7]/30 px-3 py-1 rounded-lg text-xs">{item.jumlah} {item.satuan}</span>
                            </td>
                            <td className="px-5 py-3 text-center">
                              <button type="button" onClick={() => handleRemoveFromCart(item.id_barang)} className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center text-xs">
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-slate-100 border-dashed" />

            {/* FORM MASUK */}
            {formData.jenis_mutasi === 'Masuk' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="p-4 bg-blue-50/40 border border-[#BADFE7]/40 rounded-2xl flex gap-3 text-left">
                  <span className="text-[#388087] mt-0.5"><i className="fas fa-circle-info text-sm"></i></span>
                  <div className="space-y-0.5">
                    <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Informasi Pemasokan</h5>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Silakan cari asal distributor. Jika nama <span className="text-[#388087] font-bold">tidak ada dalam pilihan</span>, Anda <span className="text-rose-500 font-bold">wajib</span> mencentang opsi manual. Jangan lupa melampirkan foto kwitansi/DO.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-1 pt-1">
                  <input type="checkbox" id="manualSupplierCheck" checked={isManualSupplier} onChange={(e) => { setIsManualSupplier(e.target.checked); setFormData(prev => ({ ...prev, supplier_id: '', new_supplier_name: '', new_supplier_contact: '', new_supplier_address: '' })); }} className="w-4 h-4 rounded text-[#388087] focus:ring-[#388087]/30 border-slate-300 cursor-pointer" />
                  <label htmlFor="manualSupplierCheck" className="text-xs font-bold text-slate-600 cursor-pointer select-none">Tambah Supplier Baru Secara Manual <span className="text-rose-500 font-black">*</span></label>
                </div>

                {!isManualSupplier ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Asal Mitra Supplier <span className="text-rose-500">*</span></label>
                    <select value={formData.supplier_id} className="w-full px-5 h-[54px] bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-[#388087] transition-all appearance-none cursor-pointer font-bold text-slate-700 shadow-sm" onChange={(e) => setFormData(prev => ({...prev, supplier_id: e.target.value}))}>
                      <option value="">-- Pilih Supplier Penyedia Barang --</option>
                      {supplierList.map((sup) => <option key={sup.id_supplier} value={sup.id_supplier}>{sup.nama_supplier} {sup.kontak ? `(${sup.kontak})` : ''}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nama Supplier Baru <span className="text-rose-500">*</span></label>
                        <input type="text" placeholder="Nama Perusahaan / Distributor (Wajib)" value={formData.new_supplier_name} className="w-full px-5 h-[50px] bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-[#388087] font-semibold text-slate-700 shadow-sm text-sm" onChange={(e) => setFormData(prev => ({...prev, new_supplier_name: e.target.value}))} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nomor Kontak / Telepon</label>
                        <input type="text" placeholder="021-xxxxxx atau 08xxxxxx (Opsional)" value={formData.new_supplier_contact} className="w-full px-5 h-[50px] bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-[#388087] font-semibold text-slate-700 shadow-sm text-sm" onChange={(e) => setFormData(prev => ({...prev, new_supplier_contact: e.target.value}))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Alamat Kantor Supplier</label>
                      <input type="text" placeholder="Nama jalan, Gedung, Kota lokasi supplier... (Opsional)" value={formData.new_supplier_address} className="w-full px-5 h-[50px] bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-[#388087] font-semibold text-slate-700 shadow-sm text-sm" onChange={(e) => setFormData(prev => ({...prev, new_supplier_address: e.target.value}))} />
                    </div>
                  </div>
                )}

                <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Upload Bukti Transaksi / DO <span className="text-rose-500">*</span></label>
                  <input type="file" accept="image/*" onChange={(e) => setBuktiFile(e.target.files[0])} className="w-full file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-100 file:text-[#388087] hover:file:bg-slate-200 text-xs font-bold text-slate-500 border border-slate-200 rounded-2xl p-2 bg-white cursor-pointer" />
                </div>
              </div>
            )}

            {/* FORM KELUAR */}
            {formData.jenis_mutasi === 'Keluar' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="p-4 bg-amber-50/30 border border-amber-100/50 rounded-2xl flex gap-3 text-left">
                  <span className="text-amber-600 mt-0.5"><i className="fas fa-truck-fast text-sm"></i></span>
                  <div className="space-y-0.5">
                    <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Tujuan Distribusi Jaringan</h5>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Silakan pilih target cabang node outlet resmi. Sistem akan otomatis menyajikan <span className="text-amber-600 font-bold">Surat Jalan Preview</span> setelah mutasi disimpan untuk dicetak.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tujuan Node Outlet <span className="text-rose-500">*</span></label>
                  <div onClick={() => setShowOutletModal(true)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer hover:border-[#388087]/50 transition-all shadow-sm group">
                    {selectedOutletData ? (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0 flex items-center justify-center">
                          {selectedOutletData.gambar ? <img src={`http://localhost:5000/uploads/${selectedOutletData.gambar}`} alt="" className="w-full h-full object-cover" /> : <i className="fas fa-store text-[#388087] text-lg"></i>}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm leading-tight">{selectedOutletData.nama_outlet}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 font-medium"><i className="fas fa-location-dot text-slate-300 mr-1"></i>{selectedOutletData.alamat || 'Lokasi tidak tertera'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 py-2 px-1"><i className="fas fa-store text-slate-300"></i><span className="font-bold text-sm text-slate-400">-- Klik untuk Cari & Pilih Outlet Tujuan --</span></div>
                    )}
                    <i className="fas fa-chevron-right text-slate-300 group-hover:text-[#388087] transition-colors text-xs mr-1"></i>
                  </div>
                </div>
              </div>
            )}

            {/* FORM AUDIT */}
            {formData.jenis_mutasi === 'Audit' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="p-4 bg-rose-50/50 border border-rose-100/80 rounded-2xl flex gap-3 text-left">
                  <span className="text-rose-600 mt-0.5"><i className="fas fa-triangle-exclamation text-sm"></i></span>
                  <div className="space-y-0.5">
                    <h5 className="text-[11px] font-black text-rose-800 uppercase tracking-wider">Mode Audit & Barang Rusak</h5>
                    <p className="text-[11px] text-rose-600/80 font-medium leading-relaxed">Mode ini akan memotong stok barang dari gudang tanpa menetapkan Outlet tujuan. Anda <span className="font-bold">diwajibkan mengunggah foto barang rusak/keterangan fisik</span> dan menulis catatan alasan pada kolom di bawah.</p>
                  </div>
                </div>

                <div className="space-y-2 mt-4 pt-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Upload Foto Bukti Barang Fisik <span className="text-rose-500">*</span></label>
                  <input type="file" accept="image/*" onChange={(e) => setBuktiFile(e.target.files[0])} className="w-full file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-rose-100 file:text-rose-600 hover:file:bg-rose-200 text-xs font-bold text-slate-500 border border-rose-200 rounded-2xl p-2 bg-white cursor-pointer shadow-sm" />
                </div>
              </div>
            )}

            {/* CATATAN */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Alasan / Catatan {formData.jenis_mutasi === 'Audit' && <span className="text-rose-500">*</span>}</label>
              <textarea rows="3" value={formData.keterangan} placeholder={formData.jenis_mutasi === 'Audit' ? "Contoh: 5 Kardus basah karena atap gudang bocor..." : "Catatan operasional (Opsional)..."} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#388087] transition-all font-medium text-slate-700 shadow-inner" onChange={(e) => setFormData(prev => ({...prev, keterangan: e.target.value}))}></textarea>
            </div>

            <button type="submit" className="w-full h-[58px] bg-[#388087] hover:bg-[#2a636b] text-white rounded-2xl font-black text-[12px] tracking-[0.3em] shadow-md shadow-[#388087]/10 active:scale-[0.99] transition-all uppercase">
              Simpan Mutasi Digital
            </button>
          </form>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🖨️ MODAL SURAT JALAN PREVIEW (TAMPIL DI LAYAR)          */}
      {/* ======================================================== */}
      {showSuratJalan && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[99999] flex flex-col overflow-y-auto">
          
          {/* Action Bar */}
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white sticky top-0 z-10 shadow-xl border-b border-slate-700">
            <h3 className="font-bold text-sm tracking-widest uppercase text-slate-300"><i className="fas fa-file-invoice mr-2"></i>Preview Surat Jalan</h3>
            <div className="flex gap-4">
              <button onClick={() => window.location.reload()} className="px-5 py-2.5 text-xs font-bold bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors">Tutup & Selesai</button>
              <button onClick={executePrint} className="px-8 py-2.5 text-xs font-black bg-emerald-500 rounded-xl hover:bg-emerald-400 tracking-widest uppercase text-slate-900 shadow-lg shadow-emerald-500/20 transition-all"><i className="fas fa-print mr-2"></i>Cetak Surat</button>
            </div>
          </div>

          {/* Area UI Kertas (Hanya Tampilan Visual) */}
          <div className="flex-1 p-8 flex justify-center pb-20 items-start">
            <div className="bg-white w-full max-w-[21cm] min-h-[29.7cm] p-12 shadow-2xl text-black font-sans box-border relative">
              <div className="flex justify-between items-start border-b-4 border-black pb-6 mb-8">
                <div>
                  <h1 className="text-4xl font-black tracking-tighter mb-1">iGUDANG LOGISTICS</h1>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Main Distribution Center</p>
                  <p className="text-xs text-gray-500 mt-2">Jl. Logistik Sentral No. 99, Jakarta<br/>Hotline: (021) 555-1234</p>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-black text-gray-300 uppercase tracking-widest">SURAT JALAN</h2>
                  <p className="text-sm font-bold mt-2">Tanggal: {new Date().toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year:'numeric'})}</p>
                </div>
              </div>

              <div className="flex justify-between mb-8">
                <div className="w-1/2">
                  <p className="text-xs font-black uppercase text-gray-500 mb-1">Dikirim Kepada (Tujuan):</p>
                  <h3 className="text-lg font-bold">{selectedOutletData?.nama_outlet}</h3>
                  <p className="text-sm text-gray-600 w-3/4 leading-relaxed">{selectedOutletData?.alamat || '-'}</p>
                  <p className="text-sm font-bold mt-2">Telp: {selectedOutletData?.kontak || '-'}</p>
                </div>
                <div className="w-1/3 border border-gray-300 p-4 rounded-xl bg-gray-50">
                  <p className="text-xs font-black uppercase text-gray-500 mb-1">Catatan Pengiriman:</p>
                  <p className="text-sm italic text-gray-700 font-medium">{formData.keterangan || 'Distribusi reguler.'}</p>
                </div>
              </div>

              <table className="w-full mb-12 border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-y-2 border-black">
                    <th className="py-3 px-4 text-left font-black text-sm uppercase">No.</th>
                    <th className="py-3 px-4 text-left font-black text-sm uppercase">Nama Barang / SKU</th>
                    <th className="py-3 px-4 text-center font-black text-sm uppercase w-32">Kuantitas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 border-b-2 border-black">
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td className="py-4 px-4 font-bold text-sm">{index + 1}</td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-sm">{item.nama}</p>
                        <p className="text-xs text-gray-400">SKU: #{item.id_barang}</p>
                      </td>
                      <td className="py-4 px-4 text-center font-black text-lg">
                        {item.jumlah} <span className="text-xs font-bold text-gray-500 uppercase">{item.satuan}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between mt-20 pt-8">
                <div className="text-center w-48">
                  <p className="text-xs font-bold uppercase text-gray-500 mb-20">Admin Gudang (Pengirim)</p>
                  <div className="border-b border-black mb-2"></div>
                  <p className="text-xs font-bold">Nama Jelas & Ttd</p>
                </div>
                <div className="text-center w-48">
                  <p className="text-xs font-bold uppercase text-gray-500 mb-20">Pengemudi / Kurir</p>
                  <div className="border-b border-black mb-2"></div>
                  <p className="text-xs font-bold">Nama Jelas & Ttd</p>
                </div>
                <div className="text-center w-48">
                  <p className="text-xs font-bold uppercase text-gray-500 mb-20">Penerima Cabang</p>
                  <div className="border-b border-black mb-2"></div>
                  <p className="text-xs font-bold">Cap Toko & Ttd</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KATALOG BARANG */}
      {showKatalogModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] border shadow-2xl w-full max-w-2xl p-6 md:p-8 text-left animate-scaleUp" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-base font-black text-[#388087] uppercase tracking-wide">📦 Katalog Asset Gudang</h3>
              <button onClick={() => setShowKatalogModal(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700"><i className="fas fa-times"></i></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="relative sm:col-span-2">
                <input type="text" placeholder="Cari berdasarkan nama produk..." value={searchBarang} onChange={(e) => setSearchBarang(e.target.value)} className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#388087]" />
              </div>
              <select value={selectedKategori} onChange={(e) => setSelectedKategori(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:border-[#388087]">
                <option value="">Semua Kategori</option>
                {kategoriList.map(kat => <option key={kat.id_kategori} value={String(kat.id_kategori)}>{kat.nama}</option>)}
              </select>
            </div>
            <div className="max-h-[350px] overflow-y-auto space-y-2.5">
              {filteredBarangKatalog.map((barang) => (
                <div key={barang.id_barang} onClick={() => handleSelectBarang(barang)} className="flex items-center justify-between p-4 bg-white border border-slate-100 hover:border-[#388087] hover:bg-[#BADFE7]/10 rounded-2xl cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border">
                      {barang.gambar ? <img src={`http://localhost:5000/uploads/${barang.gambar}`} alt="" className="w-full h-full object-cover rounded-xl" /> : <i className="fas fa-box text-slate-300"></i>}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm uppercase">{barang.nama}</h4>
                      <span className="text-[10px] font-black text-slate-400">ID: #{barang.id_barang}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl text-[11px] font-black bg-emerald-50 text-[#388087] uppercase">{barang.stok} {barang.satuan}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: JARINGAN OUTLET */}
      {showOutletModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-2xl p-6 md:p-8 animate-scaleUp" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-base font-black text-[#388087] uppercase tracking-wide">🏢 Jaringan Node Outlet</h3>
              <button onClick={() => setShowOutletModal(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700"><i className="fas fa-times"></i></button>
            </div>
            <input type="text" placeholder="Cari outlet..." value={searchOutlet} onChange={(e) => setSearchOutlet(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold mb-6" />
            <div className="max-h-[350px] overflow-y-auto space-y-2.5">
              {filteredOutletKatalog.map((outlet) => (
                <div key={outlet.id_outlet} onClick={() => handleSelectOutlet(outlet)} className="flex items-center justify-between p-4 bg-white border border-slate-100 hover:border-[#388087] hover:bg-[#BADFE7]/10 rounded-2xl cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border">
                      {outlet.gambar ? <img src={`http://localhost:5000/uploads/${outlet.gambar}`} alt="" className="w-full h-full object-cover rounded-xl" /> : <i className="fas fa-store text-slate-300"></i>}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm uppercase">{outlet.nama_outlet}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">{outlet.alamat}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold border">ID: #{outlet.id_outlet}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Transaksi;