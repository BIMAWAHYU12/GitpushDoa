# TODO - Sinkronisasi Dropdown Kategori (Barang.jsx)

- [ ] Cek struktur respons API `GET /api/barang` di backend (`barangController.js`) untuk memastikan field kategori dan rak.
- [ ] Verifikasi mapping frontend: dropdown Kategori menggunakan `kategoriList` dengan field `id_kategori` dan `nama`.
- [ ] Verifikasi tampilan kolom tabel: kategori barang menggunakan `item.nama_kategori` (hasil join backend).
- [ ] Jika ada ketidaksesuaian field (mis. `kategori_id` vs `id_kategori`), perbaiki di frontend agar nyambung.
- [ ] Update file frontend `frontend/src/pages/Barang.jsx` (hanya perubahan yang diperlukan).
- [ ] Jalankan build/lint singkat (jika ada) atau minimal pastikan tidak ada error sintaks.
