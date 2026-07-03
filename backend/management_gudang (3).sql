-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 02 Jul 2026 pada 15.35
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `management_gudang`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `barang`
--

CREATE TABLE `barang` (
  `id_barang` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `kategori_id` int(11) DEFAULT NULL,
  `rak_id` int(11) DEFAULT NULL,
  `stok` int(11) DEFAULT 0,
  `satuan` varchar(20) NOT NULL DEFAULT 'Pcs',
  `gambar` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `barang`
--

INSERT INTO `barang` (`id_barang`, `nama`, `kategori_id`, `rak_id`, `stok`, `satuan`, `gambar`, `created_at`) VALUES
(1, 'Beras Pandan Wangi 25kg (Karung)', 1, 1, 45, 'Karung', '1782381168682-1000265851-removebg-preview.png', '2026-06-17 07:19:15'),
(2, 'Beras Setra Ramos 10kg (Karung)', 1, 1, 60, 'Karung', '1782381108581-brd-44261_beras-cap-bunga-10-kg_full01.jpg.jpeg', '2026-06-17 07:19:15'),
(3, 'Minyak Goreng Filma 2 Liter', 1, 2, 119, 'Pouch', '1782380697814-images.jpeg', '2026-06-17 07:19:15'),
(4, 'Minyak Goreng Bimoli 1 Liter', 1, 2, 85, 'Pouch', '1782380837297-images_(1)_(1).jpeg', '2026-06-17 07:19:15'),
(5, 'Gula Pasir Gulaku Premium 1kg', 3, 4, 200, 'Pack', '1782380891308-images_(2).jpeg', '2026-06-17 07:19:15'),
(6, 'Indomie Goreng Spesial (Karton/Isi 40)', 2, 3, 35, 'Karton', '1782381780239-IMG_20260625_160524.jpg.jpeg', '2026-06-17 07:19:15'),
(7, 'Sedaap Mie Soto Ayam (Karton/Isi 40)', 2, 3, 28, 'Karton', '1782381959882-IMG_20260625_160404.jpg.jpeg', '2026-06-17 07:19:15'),
(8, 'Sarden ABC Tomat 425g (Kaleng)', 2, 3, 150, 'Kaleng', '1782381971194-br-m036969-04543_abc-sarden-tomat-425gr_full01-1ec742e1.jpg.jpeg', '2026-06-17 07:19:15'),
(9, 'Kopi Kapal Api Mantap 165g', 3, 4, 90, 'Pack', '1782381981013-kapal-api_kapal-api-kopi-special-165gr-pak_full01.jpg.jpeg', '2026-06-17 07:19:15'),
(10, 'Teh Celup Sariwangi Isi 25', 3, 4, 140, 'Pcs', '1782381825636-sariwangi_sariwangi_teh_celup_asli_isi_25_pc_full03_jk75r6vm.jpg.jpeg', '2026-06-17 07:19:15'),
(11, 'Chiki Balls Keju 16g (Dus/Isi 60)', 4, 5, 15, 'Dus', '1782381548252-chikiBallsKeju_16gr.jpg.jpeg', '2026-06-17 07:19:15'),
(12, 'Roma Biskuit Kelapa 300g', 4, 5, 75, 'Pcs', '1782381689781-Roma_Biskuit_Kelapa.jpg.jpeg', '2026-06-17 07:19:15'),
(13, 'Sabun Mandi Lifebuoy Merah 85g', 5, 6, 250, 'Pcs', '1782382186832-Sabun_Mandi_Lifebuoy.jpg.jpeg', '2026-06-17 07:19:15'),
(14, 'Shampoo Pantene Hairfall 150ml', 5, 6, 110, 'Pcs', '1782381862861-Shampoo_Pantene_Hairfalll.png', '2026-06-17 07:19:15'),
(15, 'Rinso Anti Noda Bubuk 700g', 6, 6, 65, 'Pack', '1782381840663-Rinso_Anti_Noda_Bubuk.jpg.jpeg', '2026-06-17 07:19:15'),
(16, 'Susu Kental Manis Frisian Flag Gold 370g (Kaleng)', 2, 3, 80, 'Kaleng', '1782382178107-AhaConvert_susu_frisian_flag_370g.jpg.jpeg', '2026-06-25 07:17:47'),
(17, 'Kecap Manis Bango Refill 520ml', 7, 4, 12, 'Pouch', '1782382169553-AhaConvert_kecap_520ml.jpg.jpeg', '2026-06-25 07:17:47'),
(18, 'Garam Dapur Beriodium Cap Kapal 250g', 7, 4, 50, 'Pack', '1782382161825-AhaConvert_garam_250g.jpg.jpeg', '2026-06-25 07:17:47'),
(19, 'Pepsodent Pencegah Gigi Berlubang 190g', 5, 6, 136, 'Pcs', '1782382152987-AhaConvert_Pepsodent_190g.jpg.jpeg', '2026-06-25 07:17:47'),
(20, 'Kopi Luwak White Koffie (Isi 10 Sachet)', 3, 4, 16, 'Pack', '1782382143846-AhaConvert_luwak_wht_koffie.jpg.jpeg', '2026-06-25 07:17:47');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategori`
--

CREATE TABLE `kategori` (
  `id_kategori` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kategori`
--

INSERT INTO `kategori` (`id_kategori`, `nama`) VALUES
(1, 'BAHAN POKOK & SEMBAKO'),
(2, 'MAKANAN INSTAN & KALENG'),
(3, 'MINUMAN & BUBUK KOPI TEH'),
(4, 'MAKANAN RINGAN & SNACK'),
(5, 'PERAWATAN TUBUH & MANDI'),
(6, 'DETERJEN & KEBERSIHAN RUMAH'),
(7, 'PERLENGKAPAN DAPUR & BUMBU'),
(8, 'PRODUK LAIN-LAIN');

-- --------------------------------------------------------

--
-- Struktur dari tabel `outlet`
--

CREATE TABLE `outlet` (
  `id_outlet` int(11) NOT NULL,
  `nama_outlet` varchar(100) NOT NULL,
  `alamat` text DEFAULT NULL,
  `kontak` varchar(50) DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `outlet`
--

INSERT INTO `outlet` (`id_outlet`, `nama_outlet`, `alamat`, `kontak`, `gambar`) VALUES
(1, 'Toko Sejahtera Cabang Depok', 'Jl. Margonda Raya No. 12, Depok', '021-778899', '1781680558367-Gemini_Generated_Image_c8qiwhc8qiwhc8qi.png'),
(2, 'Toko Sejahtera Cabang Cibinong', 'Jl. Raya Jakarta-Bogor KM 41, Bogor', '021-879012', '1781680539818-Gemini_Generated_Image_c8qiwhc8qiwhc8qi.png'),
(3, 'Toko Sejahtera Cabang Bogor', 'Jl. Raya Pajajaran No. 88, Bogor', '0251-831234', '1781680529294-Gemini_Generated_Image_c8qiwhc8qiwhc8qi.png'),
(4, 'Toko Sejahtera Cabang Jakarta', 'Jl. TB Simatupang Kav. 15, Jakarta Selatan', '021-780123', '1781680509341-Gemini_Generated_Image_c8qiwhc8qiwhc8qi.png');

-- --------------------------------------------------------

--
-- Struktur dari tabel `rak`
--

CREATE TABLE `rak` (
  `id_rak` int(11) NOT NULL,
  `nama_rak` varchar(100) NOT NULL,
  `keterangan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `rak`
--

INSERT INTO `rak` (`id_rak`, `nama_rak`, `keterangan`) VALUES
(1, 'ZONA-A01 (BERAS & KARUNGAN)', 'Area Depan Lantai Bawah - Khusus Beban Berat'),
(2, 'ZONA-A02 (MINYAK & CAIRAN)', 'Samping Kiri - Dekat Drainase Pengaman Kebocoran'),
(3, 'ZONA-B01 (MIE INSTAN & KALENG)', 'Lajur Tengah - Rak Tingkat Karatan/Kartonan'),
(4, 'ZONA-B02 (KOPI, TEH & GULA)', 'Lajur Tengah - Dekat Meja Kasir / Cetak Etiket'),
(5, 'ZONA-C01 (SNACK & BISKUIT)', 'Area Belakang Atas - Kering dan Bebas Lembab'),
(6, 'ZONA-C02 (SABUN & DETERJEN)', 'Sudut Kanan - Terpisah dari Komoditas Makanan');

-- --------------------------------------------------------

--
-- Struktur dari tabel `supplier`
--

CREATE TABLE `supplier` (
  `id_supplier` int(11) NOT NULL,
  `nama_supplier` varchar(100) NOT NULL,
  `kontak` varchar(50) DEFAULT NULL,
  `alamat` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `supplier`
--

INSERT INTO `supplier` (`id_supplier`, `nama_supplier`, `kontak`, `alamat`) VALUES
(1, 'PT INDOMARCO ADIPRIMA (INDOFOOD)', '021-5709111', 'Kawasan Industri Pulogadung, Jakarta'),
(2, 'PT UNILEVER INDONESIA DISTRIBUTOR', '0800-1-558000', 'BSD Boulevard Barat Blok L No.1, Tangerang'),
(3, 'PT MAYORA INDAH DISTRIBUSI', '021-8063777', 'Jl. Tomang Raya No. 21-23, Jakarta Barat'),
(4, 'PT WINGS SURYA DISTRIBUSI', '021-4602555', 'Jl. Tipar Cakung Kav. F 5-7, Jakarta Timur'),
(5, 'CV AGRA SEMBAKO UTAMA', '081299887766', 'Jl. Raya Tajur No. 45, Bogor');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaksi_stok`
--

CREATE TABLE `transaksi_stok` (
  `id_transaksi` int(11) NOT NULL,
  `id_barang` int(11) DEFAULT NULL,
  `tipe` enum('IN','OUT') DEFAULT NULL,
  `jumlah` int(11) NOT NULL,
  `tanggal` timestamp NOT NULL DEFAULT current_timestamp(),
  `keterangan` text DEFAULT NULL,
  `bukti_foto` varchar(255) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_outlet` int(11) DEFAULT NULL,
  `id_supplier` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `transaksi_stok`
--

INSERT INTO `transaksi_stok` (`id_transaksi`, `id_barang`, `tipe`, `jumlah`, `tanggal`, `keterangan`, `bukti_foto`, `id_user`, `id_outlet`, `id_supplier`) VALUES
(1, 20, 'IN', 1, '2026-06-27 06:41:18', 'barang baru masuk ', NULL, 2, NULL, 5),
(2, 19, 'OUT', 3, '2026-06-27 08:14:58', NULL, NULL, 2, 3, NULL),
(3, 17, 'IN', 5, '2026-06-27 08:36:35', NULL, NULL, 2, NULL, 5),
(4, 20, 'IN', 1, '2026-06-27 08:39:46', NULL, NULL, 2, NULL, 3),
(5, 18, 'OUT', 10, '2026-06-27 08:43:02', NULL, NULL, 2, 3, NULL),
(6, 3, 'OUT', 1, '2026-06-28 14:33:31', NULL, NULL, 2, 4, NULL),
(7, 20, 'IN', 1, '2026-06-28 14:48:57', NULL, NULL, 2, NULL, 5),
(8, 17, 'IN', 1, '2026-06-28 14:48:57', NULL, NULL, 2, NULL, 5),
(9, 19, 'IN', 1, '2026-06-28 14:53:47', NULL, NULL, 2, NULL, 3),
(10, 19, 'OUT', 3, '2026-06-28 14:54:42', NULL, NULL, 7, 2, NULL),
(11, 17, 'OUT', 100, '2026-06-28 14:57:30', NULL, NULL, 7, 4, NULL),
(12, 20, 'IN', 1, '2026-06-29 03:15:18', NULL, '1782702918849-AhaConvert_susu frisian flag 370g.jpg.jpeg', 1, NULL, 5),
(13, 19, 'IN', 3, '2026-06-29 03:15:18', NULL, '1782702918849-AhaConvert_susu frisian flag 370g.jpg.jpeg', 1, NULL, 5),
(14, 19, 'OUT', 1, '2026-06-29 03:16:00', NULL, NULL, 1, 3, NULL),
(15, 19, 'OUT', 1, '2026-06-29 03:16:29', NULL, NULL, 1, 3, NULL),
(16, 19, 'OUT', 1, '2026-06-29 03:25:55', NULL, NULL, 1, 3, NULL),
(17, 20, 'OUT', 1, '2026-06-29 03:29:36', '[AUDIT STOK] rusak', '1782703776742-AhaConvert_luwak wht koffie.jpg.jpeg', 1, NULL, NULL),
(18, 20, 'OUT', 1, '2026-06-29 03:33:11', NULL, NULL, 1, 3, NULL),
(19, 20, 'IN', 1, '2026-06-30 12:53:36', NULL, '1782824016170-AhaConvert_luwak wht koffie.jpg.jpeg', 1, NULL, 4),
(20, 19, 'OUT', 1, '2026-06-30 12:53:47', NULL, NULL, 1, 1, NULL),
(21, 18, 'OUT', 1, '2026-06-30 12:54:44', NULL, NULL, 1, 2, NULL),
(22, 20, 'OUT', 1, '2026-06-30 13:05:05', NULL, NULL, 1, 2, NULL),
(23, 18, 'OUT', 1, '2026-06-30 13:05:05', NULL, NULL, 1, 2, NULL),
(24, 18, 'IN', 1, '2026-06-30 13:12:53', NULL, '1782825173580-AhaConvert_luwak wht koffie.jpg.jpeg', 1, NULL, 2),
(25, 19, 'IN', 1, '2026-06-30 13:22:04', NULL, '1782825724199-IMG_20260625_160524.jpg.jpeg', 2, NULL, 5),
(26, 20, 'IN', 2, '2026-06-30 13:22:04', NULL, '1782825724199-IMG_20260625_160524.jpg.jpeg', 2, NULL, 5),
(27, 19, 'OUT', 1, '2026-06-30 13:22:13', NULL, NULL, 2, 4, NULL),
(28, 17, 'OUT', 1, '2026-06-30 13:22:36', '[AUDIT STOK] barngnya rusak\r\n', '1782825756404-AhaConvert_kecap 520ml.jpg.jpeg', 2, NULL, NULL),
(29, 18, 'IN', 1, '2026-06-30 13:29:54', NULL, '1782826194655-kapal-api_kapal-api-kopi-special-165gr-pak_full01.jpg.jpeg', 2, NULL, 3),
(30, 19, 'IN', 1, '2026-06-30 13:29:54', NULL, '1782826194655-kapal-api_kapal-api-kopi-special-165gr-pak_full01.jpg.jpeg', 2, NULL, 3),
(31, 20, 'IN', 5, '2026-06-30 14:29:28', NULL, '1782829768786-Rinso Anti Noda Bubuk.jpg.jpeg', 1, NULL, 3),
(32, 19, 'IN', 1, '2026-06-30 14:29:28', NULL, '1782829768786-Rinso Anti Noda Bubuk.jpg.jpeg', 1, NULL, 3),
(33, 20, 'OUT', 1, '2026-06-30 14:29:59', NULL, NULL, 1, 4, NULL),
(34, 18, 'IN', 3, '2026-06-30 15:27:08', NULL, '1782833228183-br-m036969-04543_abc-sarden-tomat-425gr_full01-1ec742e1.jpg.jpeg', 2, NULL, 3),
(35, 18, 'OUT', 1, '2026-06-30 15:47:08', NULL, NULL, 1, 2, NULL),
(36, 20, 'OUT', 1, '2026-06-30 15:48:09', NULL, NULL, 2, 4, NULL),
(37, 20, 'OUT', 100, '2026-06-30 15:48:50', NULL, NULL, 2, 3, NULL),
(38, 17, 'IN', 12, '2026-07-02 01:19:24', NULL, '1782955164756-AhaConvert_kecap 520ml.jpg.jpeg', 2, NULL, 3),
(39, 18, 'OUT', 60, '2026-07-02 01:19:43', NULL, NULL, 2, 4, NULL),
(40, 20, 'OUT', 1, '2026-07-02 06:58:58', NULL, NULL, 1, 3, NULL),
(41, 18, 'OUT', 2, '2026-07-02 06:59:17', NULL, NULL, 1, 3, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff') DEFAULT 'staff',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_seen` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id_user`, `username`, `password`, `role`, `created_at`, `last_seen`) VALUES
(1, 'bima', '$2b$10$zH9KH7kpnzLMPALPDAf6neINJCjg2lTtVJgy2A7AvQEGi5uJpd4rm', 'admin', '2026-04-20 10:53:36', '2026-07-02 20:16:04'),
(2, 'farhan', '$2b$10$or9KkkqdhgOFC1IAi.EEquttlxZzTGl4KPdGQLCIq9uhMc44QRfjO', 'staff', '2026-04-20 10:53:36', '2026-07-02 14:04:25'),
(7, 'yurida', '$2b$10$d4y9nJvCVC9FNjpzNSh2tOIF3QBQaHh0SqdoinqfN0ic7SBu22HVi', 'staff', '2026-06-28 14:54:13', '2026-06-28 21:57:36'),
(8, 'rafif', '$2b$10$oOoJzgq3MiiD94A.uuz/d.VrRvnSPnS9QKwZ/FueHEQcJyvctnmhG', 'staff', '2026-07-02 01:30:17', NULL),
(9, 'alya', '$2b$10$IR4K5fJf7e1j/2SHXwT76u/E8nL7SZVQzKjFqkTOqZaFrM9qV61h2', 'staff', '2026-07-02 01:30:31', NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`id_barang`),
  ADD KEY `kategori_id` (`kategori_id`),
  ADD KEY `rak_id` (`rak_id`);

--
-- Indeks untuk tabel `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indeks untuk tabel `outlet`
--
ALTER TABLE `outlet`
  ADD PRIMARY KEY (`id_outlet`);

--
-- Indeks untuk tabel `rak`
--
ALTER TABLE `rak`
  ADD PRIMARY KEY (`id_rak`);

--
-- Indeks untuk tabel `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id_supplier`);

--
-- Indeks untuk tabel `transaksi_stok`
--
ALTER TABLE `transaksi_stok`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `id_barang` (`id_barang`),
  ADD KEY `fk_user_transaksi` (`id_user`),
  ADD KEY `fk_transaksi_outlet` (`id_outlet`),
  ADD KEY `fk_transaksi_supplier` (`id_supplier`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `barang`
--
ALTER TABLE `barang`
  MODIFY `id_barang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT untuk tabel `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `outlet`
--
ALTER TABLE `outlet`
  MODIFY `id_outlet` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `rak`
--
ALTER TABLE `rak`
  MODIFY `id_rak` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id_supplier` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `transaksi_stok`
--
ALTER TABLE `transaksi_stok`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `barang`
--
ALTER TABLE `barang`
  ADD CONSTRAINT `barang_ibfk_1` FOREIGN KEY (`kategori_id`) REFERENCES `kategori` (`id_kategori`) ON DELETE SET NULL,
  ADD CONSTRAINT `barang_ibfk_2` FOREIGN KEY (`rak_id`) REFERENCES `rak` (`id_rak`);

--
-- Ketidakleluasaan untuk tabel `transaksi_stok`
--
ALTER TABLE `transaksi_stok`
  ADD CONSTRAINT `fk_transaksi_outlet` FOREIGN KEY (`id_outlet`) REFERENCES `outlet` (`id_outlet`),
  ADD CONSTRAINT `fk_transaksi_supplier` FOREIGN KEY (`id_supplier`) REFERENCES `supplier` (`id_supplier`),
  ADD CONSTRAINT `fk_user_transaksi` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `transaksi_stok_ibfk_1` FOREIGN KEY (`id_barang`) REFERENCES `barang` (`id_barang`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
