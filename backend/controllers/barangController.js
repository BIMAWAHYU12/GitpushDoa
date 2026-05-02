const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// 1. Ambil Semua Barang
const getAllBarang = async (req, res) => {
    try {
        const query = `
            SELECT b.*, 
                   k.nama AS nama_kategori, 
                   r.nama_rak AS nama_rak
            FROM barang b
            LEFT JOIN kategori k ON b.kategori_id = k.id_kategori
            LEFT JOIN rak r ON b.rak_id = r.id_rak
            ORDER BY b.id_barang DESC
        `;
        const [rows] = await db.query(query);
        
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

// 2. Tambah Barang
const createBarang = async (req, res) => {
    const { nama, kategori_id, rak_id, stok } = req.body;
    const gambar = req.file ? req.file.filename : null;

    if (!nama || !kategori_id || !rak_id) {
        return res.status(400).json({ message: "Nama, Kategori, dan Rak wajib diisi!" });
    }

    try {
        const query = `
            INSERT INTO barang (nama, kategori_id, rak_id, stok, gambar) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        await db.query(query, [
            nama, 
            kategori_id, 
            rak_id, 
            stok || 0, 
            gambar
        ]);
        
        res.status(201).json({ 
            message: "Barang berhasil ditambahkan!",
            data: { nama, kategori_id, rak_id, stok, gambar }
        });
    } catch (err) {
        console.error("[CREATE BARANG ERROR]:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// 3. Update Barang
const updateBarang = async (req, res) => {
    const { id } = req.params;
    const { nama, kategori_id, rak_id, stok } = req.body; 
    try {
        const [cek] = await db.query(
            "SELECT * FROM barang WHERE id_barang = ?",
            [id]
        );

        if (cek.length === 0) {
            return res.status(404).json({ message: "Barang tidak ditemukan" });
        }

        const barangLama = cek[0];

        if (!nama || !kategori_id || !rak_id) {
            return res.status(400).json({ message: "Data tidak lengkap" });
        }

        const stokFinal = stok !== undefined ? stok : barangLama.stok;

        if (stokFinal < 0) {
            return res.status(400).json({ message: "Stok tidak boleh minus" });
        }

        let query, params;

        if (req.file) {
            if (barangLama.gambar) {
                const oldPath = path.join(__dirname, "../uploads/", barangLama.gambar);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            query = `
                UPDATE barang 
                SET nama=?, kategori_id=?, rak_id=?, stok=?, gambar=? 
                WHERE id_barang=?
            `;
            params = [nama, kategori_id, rak_id, stokFinal, req.file.filename, id];
        } else {
            query = `
                UPDATE barang 
                SET nama=?, kategori_id=?, rak_id=?, stok=? 
                WHERE id_barang=?
            `;
            params = [nama, kategori_id, rak_id, stokFinal, id];
        }

        await db.query(query, params);
        res.json({ message: "Barang berhasil diupdate!" });

    } catch (err) {
        console.error("[UPDATE BARANG ERROR]:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// 4. Hapus Barang
const deleteBarang = async (req, res) => {
    const { id } = req.params;

    try {
        const [cek] = await db.query("SELECT gambar FROM barang WHERE id_barang = ?", [id]);
        if (cek.length === 0) {
            return res.status(404).json({ message: "Barang tidak ditemukan" });
        }

        if (cek[0].gambar) {
            const filePath = path.join(__dirname, "../uploads/", cek[0].gambar);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await db.query("DELETE FROM barang WHERE id_barang = ?", [id]);
        res.json({ message: "Barang berhasil dihapus!" });

    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ 
                message: "Gagal: Barang ini sudah punya riwayat transaksi dan tidak bisa dihapus!" 
            });
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