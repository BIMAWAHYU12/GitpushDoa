import { useEffect, useState } from "react";

const DataBarang = () => {
  const [barangData, setBarangData] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [rakList, setRakList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Kontrol Modal Form (Tambah / Edit)
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Inisialisasi state field 'satuan' bawaan dari database
  const [formData, setFormData] = useState({
    nama: "",
    kategori_id: "",
    rak_id: "",
    stok: 0,
    satuan: "Pcs", // Default standar grosir
  });
  const [imageFile, setImageFile] = useState(null);

  // State untuk Kontrol Modal QR Code Preview
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrItem, setQrItem] = useState(null);

  const token = localStorage.getItem("token");
  // Cek apakah user yang login adalah admin
  const isAdmin = localStorage.getItem("user_role") === "admin";
  const headers = { Authorization: `Bearer ${token}` };

  // 1. 🔄 FETCH DATA AUTOMATIC DARI BACKEND CONTROLLER (PAKET LENGKAP)
  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:5000/api/barang", {
        method: "GET",
        headers,
      });
      const result = await response.json();

      // Ambil data barang untuk tabel utama
      const finalBarang = result.data || [];
      setBarangData(finalBarang);

      // Ambil data kategori dan rak otomatis dari response database backend
      setKategoriList(result.kategori_list || []);
      setRakList(result.rak_list || []);
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
    setFormData({
      nama: "",
      kategori_id: "",
      rak_id: "",
      stok: 0,
      satuan: "Pcs",
    }); // Reset ke Pcs
    setImageFile(null);
    setShowFormModal(true);
  };

  // 3. Handler Buka Form Edit Data
  const handleOpenEdit = (item) => {
    setIsEditMode(true);
    setCurrentId(item.id_barang);
    setFormData({
      nama: item.nama || "",
      kategori_id: item.kategori_id ? String(item.kategori_id) : "",
      rak_id: item.rak_id ? String(item.rak_id) : "",
      stok: item.stok || 0,
      satuan: item.satuan || "Pcs", // Ambil data string satuan asli dari MySQL
    });
    setImageFile(null);
    setShowFormModal(true);
  };

  // 4. Proses Submit Data (INSERT / UPDATE menggunakan FormData)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (
      !formData.nama ||
      !formData.kategori_id ||
      !formData.rak_id ||
      !formData.satuan
    ) {
      alert("Harap lengkapi semua data kolom, termasuk Satuan Barang!");
      return;
    }

    const dataPayload = new FormData();
    dataPayload.append("nama", formData.nama);
    dataPayload.append("kategori_id", formData.kategori_id);
    dataPayload.append("rak_id", formData.rak_id);
    dataPayload.append("stok", formData.stok);
    dataPayload.append("satuan", formData.satuan); // Kirim data pilihan dropdown ke Express
    if (imageFile) {
      dataPayload.append("gambar", imageFile);
    }

    try {
      const apiUrl = isEditMode
        ? `http://localhost:5000/api/barang/${currentId}`
        : "http://localhost:5000/api/barang";

      const response = await fetch(apiUrl, {
        method: isEditMode ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: dataPayload,
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Gagal memproses data produk");

      alert(
        isEditMode
          ? "Barang berhasil diperbarui!"
          : "Barang baru berhasil ditambahkan!"
      );
      setShowFormModal(false);
      loadInitialData();
    } catch (err) {
      alert(`⚠️ Error: ${err.message}`);
    }
  };

  // 5. Fungsi Aksi Hapus Barang
  const handleDeleteItem = async (id) => {
    if (
      !window.confirm(
        "Apakah Anda yakin ingin menghapus aset barang ini dari database gudang?"
      )
    )
      return;

    try {
      const response = await fetch(`http://localhost:5000/api/barang/${id}`, {
        method: "DELETE",
        headers: { ...headers, "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Gagal menghapus barang");

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
  const filteredBarang = barangData.filter(
    (item) =>
      item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nama_kategori || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans gap-3 bg-[#F6F6F2]">
        <div className="w-12 h-12 border-[3.5px] border-[#388087] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#388087] animate-pulse">
          Loading Inventory Matrix...
        </p>
      </div>
    );
  }

  return (
    // 🔥 LATAR UTAMA TETAP CREAM SATIN (#F6F6F2) SENADA LAYOUT UTAMA
    <div className="w-full space-y-6 animate-fadeIn text-left font-sans bg-[#F6F6F2] min-h-screen pt-2 px-1 text-[#388087]">
      {/* 🚀 HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-[#388087]">
            Data Barang
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Kelola aset logistik dan informasi spesifikasi barang secara
            real-time.
          </p>
        </div>
      </div>

      {/* 🔍 SEARCH & ACTION BAR */}
      <div className="flex flex-col md:flex-row items-center gap-4 px-1">
        <div className="relative flex-1 w-full">
          {/* Input pencarian tetap putih bersih kontras */}
          <input
            type="text"
            placeholder="Cari barang berdasarkan nama atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-12 py-3.5 bg-white border border-[#BADFE7] rounded-2xl text-sm font-medium text-slate-700 placeholder-slate-400 outline-none focus:border-[#388087] transition-all shadow-sm"
          />
          <i className="fas fa-search absolute right-5 top-1/2 -translate-y-1/2 text-[#388087]/50"></i>
        </div>
        {/* Tombol Tambah Barang hanya dirender jika user adalah admin */}
        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="w-full md:w-auto bg-[#388087] hover:bg-[#2a636b] text-white px-8 py-3.5 rounded-2xl font-black text-[11px] tracking-widest shadow-md shadow-[#388087]/10 active:scale-[0.98] transition-all uppercase whitespace-nowrap"
          >
            + Tambah Barang
          </button>
        )}
      </div>

      {/* 📦 TABLE CONTAINER (KOTAK TABEL TETAP PUTIH BERSIH ELEGAN) */}
      <div className="bg-white rounded-[32px] shadow-[0_4px_25px_rgba(56,128,135,0.02)] border border-[#BADFE7]/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-[#BADFE7]/20 border-b border-[#BADFE7]/40">
              <tr className="text-[10px] font-black text-[#388087]/60 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Informasi Barang</th>
                <th className="px-8 py-6">Kategori</th>
                <th className="px-8 py-6 text-center">Lokasi Rak</th>
                <th className="px-8 py-6 text-center">Stok & Satuan</th>
                {/* Kolom Aksi hanya dirender jika user adalah admin */}
                {isAdmin && <th className="px-8 py-6 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-left bg-white">
              {filteredBarang.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? "5" : "4"} // Sesuaikan jumlah kolom yang digabung berdasarkan role
                    className="px-8 py-12 text-center text-slate-400 font-bold text-xs"
                  >
                    Tidak ada data barang yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredBarang.map((item) => {
                  const imageUrl = item.gambar
                    ? `http://localhost:5000/uploads/${item.gambar}`
                    : null;
                  return (
                    <tr
                      key={item.id_barang}
                      className="hover:bg-[#BADFE7]/10 transition-all group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-14 h-14 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0 shadow-sm flex items-center justify-center">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt=""
                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <i className="fas fa-box text-[#388087]/30 text-xl"></i>
                            )}
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-slate-800 text-sm tracking-tight leading-tight mb-1">
                              {item.nama}
                            </p>
                            <span className="text-[10px] font-black text-slate-400 tracking-wider">
                              ID: #{item.id_barang}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-block whitespace-nowrap bg-[#BADFE7]/40 text-[#388087] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-[#BADFE7]/10">
                          {item.nama_kategori || `Cat ID: ${item.kategori_id}`}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 font-bold text-[11px]">
                          <i className="fas fa-location-dot text-[10px] text-slate-400"></i>
                          Koridor {item.nama_rak || item.rak_id}
                        </div>
                      </td>

                      <td className="px-8 py-5 text-center">
                        {/* Status stok kritis bernuansa Soft Rose yang nyaman di mata */}
                        <p
                          className={`font-black text-base leading-none tracking-tight ${
                            parseInt(item.stok) < 5
                              ? "text-rose-500"
                              : "text-[#388087]"
                          }`}
                        >
                          {item.stok}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase mt-1.5 tracking-tight italic">
                          {item.satuan || "Pcs"} Ready
                        </p>
                      </td>

                      {/* Baris Tombol Aksi hanya dirender jika user adalah admin */}
                      {isAdmin && (
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2.5">
                            <button
                              onClick={() => handleOpenQr(item)}
                              className="w-9 h-9 rounded-xl bg-slate-50 text-[#388087] hover:bg-[#388087] hover:text-white transition-all shadow-sm flex items-center justify-center border border-slate-200/60"
                            >
                              <i className="fas fa-qrcode text-xs"></i>
                            </button>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="w-9 h-9 rounded-xl bg-slate-50 text-slate-700 hover:bg-[#6FB3B8] hover:text-white transition-all shadow-sm flex items-center justify-center border border-slate-200/60"
                            >
                              <i className="fas fa-pen text-xs"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id_barang)}
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

      {/* ─── 🛠️ MODAL BOX DIALOG: FORM TAMBAH & EDIT MASTER BARANG ─── */}
      {/* Form hanya dirender jika state modal aktif, yang mana akses button-nya sudah diproteksi */}
      {showFormModal && isAdmin && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div
            className="bg-white rounded-[32px] border border-[#BADFE7]/40 shadow-2xl w-full max-w-lg p-6 md:p-8 animate-scaleUp text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-base font-black text-[#388087] uppercase tracking-wider">
                {isEditMode ? "📝 Edit Aset Barang" : "📦 Tambah Barang Baru"}
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">
                  Nama Produk
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Mie Indomie Goreng (Karton)"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#388087]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">
                    Kategori Kelontong
                  </label>
                  <select
                    value={formData.kategori_id}
                    onChange={(e) =>
                      setFormData({ ...formData, kategori_id: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:border-[#388087] cursor-pointer"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {kategoriList.map((kat) => (
                      <option
                        key={kat.id_kategori}
                        value={String(kat.id_kategori)}
                      >
                        {kat.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">
                    Penempatan Rak Logistik
                  </label>
                  <select
                    value={formData.rak_id}
                    onChange={(e) =>
                      setFormData({ ...formData, rak_id: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:border-[#388087] cursor-pointer"
                  >
                    <option value="">-- Pilih Lokasi Rak --</option>
                    {rakList.map((rak) => (
                      <option key={rak.id_rak} value={String(rak.id_rak)}>
                        {rak.nama_rak}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">
                    Kuantitas
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stok}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stok: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-black text-slate-700 focus:outline-none focus:border-[#388087]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">
                    Satuan Barang
                  </label>
                  <select
                    value={formData.satuan}
                    onChange={(e) =>
                      setFormData({ ...formData, satuan: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:border-[#388087] cursor-pointer"
                  >
                    <option value="Pcs">Pcs (Satuan)</option>
                    <option value="Karung">Karung</option>
                    <option value="Karton">Karton</option>
                    <option value="Dus">Dus</option>
                    <option value="Pack">Pack</option>
                    <option value="Pouch">Pouch</option>
                    <option value="Kaleng">Kaleng</option>
                    <option value="Botol">Botol</option>
                    <option value="Kotak">Kotak</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">
                    Foto Produk Asset
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#388087] hover:bg-[#2a636b] text-white rounded-xl font-black text-xs tracking-widest uppercase shadow-md shadow-[#388087]/10 active:scale-[0.98] transition-all"
                >
                  {isEditMode
                    ? "Simpan Pembaruan Aset"
                    : "Daftarkan Barang Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🖨️ MODAL BOX DIALOG: LIVE PREVIEW QR CODE */}
      {showQrModal && qrItem && isAdmin && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div
            className="bg-white rounded-[32px] border border-[#BADFE7]/40 shadow-2xl w-full max-w-sm p-6 text-center animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <h4 className="text-[10px] font-black text-[#388087] tracking-wider uppercase">
                iGUDANG Sistem Label QR
              </h4>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl inline-block mx-auto shadow-inner mb-4">
              <img
                // 🔥 GANTI KE QRSERVER API
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  `${qrItem.nama} tersedia (${qrItem.stok}) ${qrItem.satuan}`
                )}`}
                alt="QR Code Asset"
                className="w-44 h-44 object-contain shadow-sm rounded-lg bg-white p-2"
              />
            </div>
            <div className="space-y-1 mb-5">
              <h3 className="font-bold text-slate-900 text-sm uppercase truncate px-2">
                {qrItem.nama}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest">
                RAK: {qrItem.nama_rak || qrItem.rak_id} • SKU:{" "}
                {qrItem.id_barang}
              </p>
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
