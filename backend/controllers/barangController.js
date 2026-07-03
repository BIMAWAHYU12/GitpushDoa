const db = require("../config/db");
const fs = require("fs");
const path = require("path");

const getAllBarang = async (req, res) => {
    try {
        const queryBarang = `
            SELECT b.*, 
                   k.nama AS nama_kategori, 
                   r.nama_rak AS nama_rak
            FROM barang b
            LEFT JOIN kategori k ON b.kategori_id = k.id_kategori
            LEFT JOIN rak r ON b.rak_id = r.id_rak
            ORDER BY b.id_barang DESC
        `;

        const [barangRows] = await db.query(queryBarang);
        const [kategoriRows] = await db.query("SELECT id_kategori, nama FROM kategori ORDER BY id_kategori ASC");
        const [rakRows] = await db.query("SELECT id_rak, nama_rak FROM rak ORDER BY id_rak ASC");
        
        const finalBarangData = (barangRows || []).map(item => ({
            ...item,
            url_gambar: item.gambar 
                ? `http://localhost:5000/uploads/${item.gambar}` 
                : `http://localhost:5000/uploads/default.png`
        }));

        res.json({
            status: "success",
            data: finalBarangData,
            kategori_list: kategoriRows || [], 
            rak_list: rakRows || []
        });

    } catch (err) {
        console.error("[GET ALL BARANG PACKET ERROR]:", err.message);
        res.status(500).json({ error: err.message });
    }
};

const createBarang = async (req, res) => {
    const { nama, kategori_id, rak_id, stok, satuan } = req.body;
    const gambar = req.file ? req.file.filename : null;

    if (!nama || !kategori_id || !rak_id || !satuan) {
        return res.status(400).json({ message: "Nama, Kategori, Rak, dan Satuan wajib diisi!" });
    }

    try {
        const query = `
            INSERT INTO barang (nama, kategori_id, rak_id, stok, satuan, gambar) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        await db.query(query, [
            nama, 
            kategori_id, 
            rak_id, 
            stok || 0, 
            satuan, 
            gambar
        ]);
        
        res.status(201).json({ 
            message: "Barang berhasil ditambahkan!",
            data: { nama, kategori_id, rak_id, stok, satuan, gambar }
        });
    } catch (err) {
        console.error("[CREATE BARANG ERROR]:", err.message);
        res.status(500).json({ error: err.message });
    }
};

const updateBarang = async (req, res) => {
    const { id } = req.params;
    const { nama, kategori_id, rak_id, stok, satuan } = req.body; 
    try {
        const [cek] = await db.query(
            "SELECT * FROM barang WHERE id_barang = ?",
            [id]
        );

        if (cek.length === 0) {
            return res.status(404).json({ message: "Barang tidak ditemukan" });
        }

        const barangLama = cek[0];

        if (!nama || !kategori_id || !rak_id || !satuan) {
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
                SET nama=?, kategori_id=?, rak_id=?, stok=?, satuan=?, gambar=? 
                WHERE id_barang=?
            `;
            params = [nama, kategori_id, rak_id, stokFinal, satuan, req.file.filename, id];
        } else {
            query = `
                UPDATE barang 
                SET nama=?, kategori_id=?, rak_id=?, stok=?, satuan=? 
                WHERE id_barang=?
            `;
            params = [nama, kategori_id, rak_id, stokFinal, satuan, id];
        }

        await db.query(query, params);
        res.json({ message: "Barang berhasil diupdate!" });

    } catch (err) {
        console.error("[UPDATE BARANG ERROR]:", err.message);
        res.status(500).json({ error: err.message });
    }
};

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