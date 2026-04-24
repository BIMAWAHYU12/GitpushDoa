const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// 1. Ambil Semua Barang (Lengkap dengan Nama Kategori & Rak)
const getAllBarang = async (req, res) => {
    try {
        const query = `
            SELECT b.*, k.nama_kategori, r.nama_rak 
            FROM barang b
            LEFT JOIN kategori k ON b.id_kategori = k.id_kategori
            LEFT JOIN rak r ON b.id_rak = r.id_rak
            ORDER BY b.id_barang DESC
        `;
        const [rows] = await db.query(query);
        
        // Tambahin Full URL buat gambar
        const data = rows.map(item => ({
            ...item,
            url_gambar: item.gambar 
                ? `http://localhost:5000/uploads/${item.gambar}` 
                : `http://localhost:5000/uploads/default.png`
        }));

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Tambah Barang Baru (Support Upload Gambar)
const createBarang = async (req, res) => {
    const { nama, id_kategori, id_rak, stok, harga } = req.body;
    const gambar = req.file ? req.file.filename : null;

    if (!nama || !id_kategori || !id_rak) {
        return res.status(400).json({ message: "Nama, Kategori, dan Rak wajib diisi!" });
    }

    try {
        const query = "INSERT INTO barang (nama, id_kategori, id_rak, stok, harga, gambar) VALUES (?, ?, ?, ?, ?, ?)";
        await db.query(query, [nama, id_kategori, id_rak, stok || 0, harga || 0, gambar]);
        
        res.status(201).json({ message: "Barang berhasil ditambahkan!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Update Barang (Bisa Ganti Gambar)
const updateBarang = async (req, res) => {
    const { id } = req.params;
    const { nama, id_kategori, id_rak, stok, harga } = req.body;
    let query, params;

    try {
        // Cek dulu barangnya ada atau gak
        const [cek] = await db.query("SELECT gambar FROM barang WHERE id_barang = ?", [id]);
        if (cek.length === 0) return res.status(404).json({ message: "Barang tidak ditemukan" });

        if (req.file) {
            // Jika ada upload gambar baru, hapus gambar lama (biar gak menuhi storage)
            if (cek[0].gambar) {
                const oldPath = path.join(__dirname, "../uploads/", cek[0].gambar);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            
            query = "UPDATE barang SET nama=?, id_kategori=?, id_rak=?, stok=?, harga=?, gambar=? WHERE id_barang=?";
            params = [nama, id_kategori, id_rak, stok, harga, req.file.filename, id];
        } else {
            query = "UPDATE barang SET nama=?, id_kategori=?, id_rak=?, stok=?, harga=? WHERE id_barang=?";
            params = [nama, id_kategori, id_rak, stok, harga, id];
        }

        await db.query(query, params);
        res.json({ message: "Barang berhasil diupdate!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Hapus Barang (Hapus Gambar juga di Folder)
const deleteBarang = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Cari nama file gambarnya dulu
        const [cek] = await db.query("SELECT gambar FROM barang WHERE id_barang = ?", [id]);
        if (cek.length === 0) return res.status(404).json({ message: "Barang tidak ditemukan" });

        // 2. Hapus file fisiknya di folder uploads
        if (cek[0].gambar) {
            const filePath = path.join(__dirname, "../uploads/", cek[0].gambar);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        // 3. Hapus data di database
        await db.query("DELETE FROM barang WHERE id_barang = ?", [id]);
        
        res.json({ message: "Barang berhasil dihapus!" });
    } catch (err) {
        // Error handling kalau barang masih dipakai di transaksi (Foreign Key Constraint)
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: "Gagal: Barang ini sudah punya riwayat transaksi dan tidak bisa dihapus!" });
        }
        res.status(500).json({ error: err.message });
    }
};

module.exports = { 
    getAllBarang, 
    createBarang, 
    updateBarang, 
    deleteBarang 
};