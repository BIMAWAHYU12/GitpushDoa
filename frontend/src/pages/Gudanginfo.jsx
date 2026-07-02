import React, { useState } from 'react';

const DashboardGudangInfo = () => {
  const [activeTab, setActiveTab] = useState('denah');
  
  // State untuk kontrol Modal Zoom Denah
  const [showDenahModal, setShowDenahModal] = useState(false);

  // 🔥 UPDATE: Penambahan Peraturan K3 Khusus Audit & Barang Rusak
  const peraturanK3 = [
    { id: "01", poin: "Alat Pelindung Diri (APD)", icon: "fas fa-shield-halved", bg: "bg-emerald-50 text-[#388087] border-emerald-100/50", detail: "Wajib helm safety, rompi reflektif, dan steel toe boots sebelum masuk area loading dock." },
    { id: "02", poin: "Zonasi Rak & SKU", icon: "fas fa-layer-group", bg: "bg-blue-50 text-blue-600 border-blue-100/50", detail: "Aset barang wajib diletakkan sesuai rak_id. Dilarang mencampur kode kategori kelontong dalam satu tier." },
    { id: "03", poin: "Kecepatan Alat Angkut", icon: "fas fa-gauge-high", bg: "bg-amber-50 text-amber-600 border-amber-100/50", detail: "Kecepatan maksimal forklift / hand pallet di koridor utama adalah 5 km/jam. Kembalikan alat ke garis kuning." },
    { id: "04", poin: "Validasi Mutasi & Foto", icon: "fas fa-qrcode", bg: "bg-purple-50 text-purple-600 border-purple-100/50", detail: "Setiap transaksi Masuk/Audit wajib menyertakan bukti foto (DO/Kwitansi/Barang Fisik) demi validitas." },
    { id: "05", poin: "Kerapian Area (5S)", icon: "fas fa-broom", bg: "bg-teal-50 text-teal-600 border-teal-100/50", detail: "Operator bertanggung jawab penuh atas kebersihan zonasi raknya. Kardus kosong wajib langsung dibuang." },
    { id: "06", poin: "Laporan Barang Rusak", icon: "fas fa-triangle-exclamation", bg: "bg-rose-50 text-rose-600 border-rose-100/50", detail: "Barang cacat/basah dilarang dibuang diam-diam! Wajib di-input via mode Audit untuk dipotong dari sistem." }
  ];

  return (
    <div className="w-full space-y-6 md:space-y-8 animate-fadeIn text-left font-sans bg-[#F6F6F2] min-h-screen pt-2 px-1 text-[#388087]">
      
      {/* ─── 🚀 BRANDING & HEADER SECTION ─── */}
      <div className="bg-gradient-to-br from-[#388087] to-[#2a636b] rounded-[24px] p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(186,223,231,0.2),transparent_45%)]"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black tracking-[0.3em] text-[#BADFE7] uppercase">HQ Logistics Center</span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none text-white">REGULASI & OPERASIONAL MATRIKS</h1>
            <p className="text-[#BADFE7] font-medium text-xs md:text-sm opacity-90">Pusat panduan standarisasi K3, denah tata letak, dan SOP 3 Pilar Mutasi Digital iGUDANG.</p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl text-xs font-black tracking-wider uppercase backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#C2EDCE] animate-pulse"></span>
              Live Node Active
            </span>
          </div>
        </div>
      </div>

      {/* ─── 🛠️ CONTROL NAVIGATION TABS ─── */}
      <div className="bg-white/60 border border-[#BADFE7] p-1.5 rounded-2xl flex flex-wrap gap-1 w-fit shadow-sm">
        <button onClick={() => setActiveTab('denah')} className={`px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'denah' ? 'bg-[#388087] text-white shadow-sm' : 'text-[#388087]/60 hover:text-[#388087]'}`}>
          <i className="fas fa-map text-xs opacity-70"></i> Denah Layout
        </button>
        <button onClick={() => setActiveTab('peraturan')} className={`px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'peraturan' ? 'bg-[#388087] text-white shadow-sm' : 'text-[#388087]/60 hover:text-[#388087]'}`}>
          <i className="fas fa-shield-halved text-xs opacity-70"></i> Peraturan K3
        </button>
        <button onClick={() => setActiveTab('sop')} className={`px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'sop' ? 'bg-[#388087] text-white shadow-sm' : 'text-[#388087]/60 hover:text-[#388087]'}`}>
          <i className="fas fa-route text-xs opacity-70"></i> SOP Alur Mutasi
        </button>
      </div>

      {/* ─── 🗺️ TAB CONTENT: 1. DENAH LAYOUT ─── */}
      {activeTab === 'denah' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          <div className="lg:col-span-8 bg-white rounded-[32px] p-6 md:p-8 border border-[#BADFE7]/60 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-black text-[#388087] text-sm md:text-base uppercase tracking-wide">Peta Grid Denah 2D Gudang</h3>
                <p className="text-xs text-slate-400 font-medium">Klik pada gambar untuk memperbesar denah koordinat rak penyimpanan.</p>
              </div>
            </div>
            
            {/* CONTAINER GAMBAR BISA DIKLIK */}
            <div 
              onClick={() => setShowDenahModal(true)}
              className="w-full aspect-[16/10] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center relative shadow-inner cursor-pointer group"
            >
              <img 
                src="http://localhost:5000/uploads/denah_gudang.png" 
                alt="Denah iGudang" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  document.getElementById('fallback-img').classList.remove('hidden');
                }}
              />
              
              {/* Overlay Kaca Pembesar */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                <i className="fas fa-magnifying-glass-plus text-4xl mb-3 drop-shadow-lg"></i>
                <span className="text-[11px] font-black tracking-[0.2em] uppercase drop-shadow-md">Klik untuk Perbesar</span>
              </div>

              <div id="fallback-img" className="hidden text-center space-y-3 p-6 z-10 absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-slate-200 text-[#388087]/40 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <i className="fas fa-map-location-dot text-lg"></i>
                </div>
                <div className="space-y-1">
                  <p className="font-black text-slate-700 text-xs uppercase tracking-wider">File `denah_gudang.png` Not Found</p>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">Letakkan gambar denah lu di folder backend `/uploads/denah_gudang.png` biar otomatis termuat disini.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[32px] p-6 border border-[#BADFE7]/60 shadow-sm space-y-4">
              <h4 className="font-black text-[10px] tracking-[0.2em] text-[#388087]/60 uppercase">Legenda Koridor Rak</h4>
              <div className="space-y-3.5">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className="w-6 h-6 rounded-lg bg-[#C2EDCE] flex items-center justify-center text-[10px] text-[#388087] font-black">R1</span>
                  <p className="text-xs font-bold text-slate-700">Rak 1 & 2: <span className="font-medium text-slate-500">Bahan Pokok</span></p>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className="w-6 h-6 rounded-lg bg-[#BADFE7] flex items-center justify-center text-[10px] text-[#388087] font-black">R2</span>
                  <p className="text-xs font-bold text-slate-700">Rak 3: <span className="font-medium text-slate-500">Makanan Instan</span></p>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className="w-6 h-6 rounded-lg bg-amber-200 flex items-center justify-center text-[10px] text-slate-700 font-black">R3</span>
                  <p className="text-xs font-bold text-slate-700">Rak 4: <span className="font-medium text-slate-500">Minuman & Kopi</span></p>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className="w-6 h-6 rounded-lg bg-purple-200 flex items-center justify-center text-[10px] text-purple-800 font-black">R4</span>
                  <p className="text-xs font-bold text-slate-700">Rak 5 & 6: <span className="font-medium text-slate-500">Personal Care</span></p>
                </div>
              </div>
            </div>

            <div className="bg-rose-50/40 border border-rose-100 rounded-[32px] p-6 space-y-3">
              <div className="flex items-center gap-2 text-rose-600">
                <i className="fas fa-triangle-exclamation text-xs"></i>
                <h4 className="font-black text-[10px] tracking-[0.2em] uppercase">Emergency Response Node</h4>
              </div>
              <div className="space-y-1 text-xs text-slate-700 font-bold">
                <div className="flex justify-between p-2 bg-white rounded-xl shadow-sm border border-rose-100/30">
                  <span className="text-slate-400 font-medium">Pos Security Utama</span>
                  <span className="text-rose-600 font-black">Ext: #112</span>
                </div>
                <div className="flex flex-col p-2 bg-white rounded-xl shadow-sm border border-rose-100/30 space-y-0.5">
                  <span className="text-slate-400 font-medium">Koordinator Lapangan K3</span>
                  <span className="text-slate-800 font-black">0812-3456-7890</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 📜 TAB CONTENT: 2. PERATURAN GUDANG K3 ─── */}
      {activeTab === 'peraturan' && (
        <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#BADFE7]/60 shadow-sm space-y-6 animate-fadeIn">
          <div>
            <h3 className="font-black text-[#388087] text-sm md:text-base uppercase tracking-wide">Standardisasi Keselamatan & Kedisiplinan</h3>
            <p className="text-xs text-slate-400 font-medium">Seluruh kru logistik wajib menerapkan sistem tata tertib ini demi integritas data dan keamanan.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {peraturanK3.map((item) => (
              <div key={item.id} className="p-6 bg-slate-50/40 hover:bg-slate-50 rounded-[24px] border border-slate-100 transition-all hover:shadow-md flex flex-col gap-4 text-left group">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0 shadow-sm border transition-transform group-hover:scale-105 ${item.bg}`}>
                    <i className={item.icon}></i>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-300 tracking-wider">RULE #{item.id}</span>
                    <h4 className="font-black text-slate-800 text-xs tracking-tight uppercase leading-tight mt-0.5">{item.poin}</h4>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 📋 TAB CONTENT: 3. STANDARD OPERATING PROCEDURE (SOP 3 PILAR MUTASI) ─── */}
      {activeTab === 'sop' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* SOP 1: STOCK IN */}
          <div className="bg-white rounded-[32px] p-6 md:p-8 border border-emerald-100/80 shadow-sm space-y-6 relative overflow-hidden group hover:border-emerald-300 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[100px] z-0 transition-transform group-hover:scale-110"></div>
            
            <div className="relative z-10 flex flex-col gap-2 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-[#388087] text-lg shadow-sm">
                <i className="fas fa-boxes-packing"></i>
              </div>
              <div className="mt-2">
                <span className="text-[9px] font-black tracking-widest text-[#388087] bg-[#C2EDCE]/70 px-2.5 py-1 rounded-md uppercase">Pilar 1: Inbound</span>
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide mt-2">SOP Stock Masuk</h3>
              </div>
            </div>
            
            <div className="relative z-10 space-y-4 font-semibold text-xs text-slate-600">
              <div className="flex gap-3"><span className="font-black text-emerald-400">01.</span><p>Terima armada ekspedisi dan periksa fisik barang.</p></div>
              <div className="flex gap-3"><span className="font-black text-emerald-400">02.</span><p>Buka form mutasi, pilih mode <span className="text-[#388087] font-black">STOCK IN</span>. Masukkan rincian barang ke keranjang.</p></div>
              <div className="flex gap-3"><span className="font-black text-emerald-400">03.</span><p>Pilih asal mitra Supplier. Jika distributor baru, centang opsi <span className="font-bold text-slate-800">Tambah Manual</span>.</p></div>
              <div className="flex gap-3"><span className="font-black text-emerald-400">04.</span><p>Wajib upload foto fisik <span className="text-slate-800 font-bold">Kwitansi/DO</span> sebagai bukti sah pengadaan.</p></div>
              <div className="flex gap-3"><span className="font-black text-emerald-400">05.</span><p>Simpan mutasi dan susun rapi fisik kardus di koridor rak sesuai legenda denah.</p></div>
            </div>
          </div>

          {/* SOP 2: STOCK OUT */}
          <div className="bg-white rounded-[32px] p-6 md:p-8 border border-amber-100/80 shadow-sm space-y-6 relative overflow-hidden group hover:border-amber-300 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-[100px] z-0 transition-transform group-hover:scale-110"></div>
            
            <div className="relative z-10 flex flex-col gap-2 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-600 text-lg shadow-sm">
                <i className="fas fa-truck-ramp-box"></i>
              </div>
              <div className="mt-2">
                <span className="text-[9px] font-black tracking-widest text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-md uppercase">Pilar 2: Outbound</span>
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide mt-2">SOP Distribusi Keluar</h3>
              </div>
            </div>

            <div className="relative z-10 space-y-4 font-semibold text-xs text-slate-600">
              <div className="flex gap-3"><span className="font-black text-amber-400">01.</span><p>Verifikasi dokumen SPB (Surat Permintaan Barang) dari Outlet tujuan.</p></div>
              <div className="flex gap-3"><span className="font-black text-amber-400">02.</span><p>Buka form mutasi, setel ke mode <span className="text-amber-600 font-black">STOCK OUT</span>. Cari dan tentukan kuantitas barang.</p></div>
              <div className="flex gap-3"><span className="font-black text-amber-400">03.</span><p>Pilih target <span className="font-bold text-slate-800">Node Outlet Cabang</span> penerima di modal jaringan.</p></div>
              <div className="flex gap-3"><span className="font-black text-amber-400">04.</span><p>Simpan mutasi. Sistem akan otomatis memotong stok dan memunculkan pop-up PDF.</p></div>
              <div className="flex gap-3"><span className="font-black text-amber-400">05.</span><p>Wajib <span className="font-bold text-slate-800">Cetak Surat Jalan</span> rangkap 3 untuk ditandatangani supir truk distribusi.</p></div>
            </div>
          </div>

          {/* SOP 3: AUDIT / RUSAK */}
          <div className="bg-white rounded-[32px] p-6 md:p-8 border border-rose-100/80 shadow-sm space-y-6 relative overflow-hidden group hover:border-rose-300 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-[100px] z-0 transition-transform group-hover:scale-110"></div>
            
            <div className="relative z-10 flex flex-col gap-2 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center text-rose-500 text-lg shadow-sm">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <div className="mt-2">
                <span className="text-[9px] font-black tracking-widest text-rose-600 bg-rose-100/80 px-2.5 py-1 rounded-md uppercase">Pilar 3: Maintenance</span>
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide mt-2">SOP Audit & Barang Rusak</h3>
              </div>
            </div>

            <div className="relative z-10 space-y-4 font-semibold text-xs text-slate-600">
              <div className="flex gap-3"><span className="font-black text-rose-400">01.</span><p>Jika ditemukan fisik barang cacat, bocor, atau basi saat <i>quality control</i>.</p></div>
              <div className="flex gap-3"><span className="font-black text-rose-400">02.</span><p>Buka form mutasi, aktifkan mode darurat <span className="text-rose-500 font-black">AUDIT / RUSAK</span>.</p></div>
              <div className="flex gap-3"><span className="font-black text-rose-400">03.</span><p>Masukkan kuantitas barang yang cacat agar sistem dapat menyesuaikan sisa stok asli.</p></div>
              <div className="flex gap-3"><span className="font-black text-rose-400">04.</span><p>Anda <span className="text-rose-600 font-black">WAJIB</span> mengunggah foto fisik barang yang rusak tersebut sebagai bukti pertanggungjawaban.</p></div>
              <div className="flex gap-3"><span className="font-black text-rose-400">05.</span><p>Tulis kronologi/alasan di kolom catatan (contoh: "Dus basah kena hujan"), lalu simpan.</p></div>
            </div>
          </div>

        </div>
      )}

      {/* ─── 🔍 MODAL LIGHTBOX FULLSCREEN DENAH ─── */}
      {showDenahModal && (
        <div 
          className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[99999] flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setShowDenahModal(false)}
        >
          {/* Action Bar */}
          <div className="absolute top-6 right-6 lg:top-10 lg:right-10 flex gap-4">
            <button 
              className="bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors backdrop-blur-md border border-white/20"
              onClick={() => setShowDenahModal(false)}
              title="Tutup (Esc)"
            >
              <i className="fas fa-xmark text-xl"></i>
            </button>
          </div>

          <p className="absolute bottom-10 text-white/50 text-xs font-black tracking-widest uppercase">Klik area mana saja untuk menutup</p>

          {/* Gambar Denah Skala Penuh */}
          <img 
            src="http://localhost:5000/uploads/denah_gudang.png" 
            alt="Denah iGudang Fullscreen" 
            className="w-full max-w-6xl max-h-[85vh] object-contain rounded-2xl shadow-2xl border-2 border-white/10"
            onClick={(e) => e.stopPropagation()} // Supaya kalau klik gambar gak langsung nutup
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

    </div>
  );
};

export default DashboardGudangInfo;