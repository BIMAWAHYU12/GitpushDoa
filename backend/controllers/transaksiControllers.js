const db = require('../config/db'); // Pastikan path ke koneksi database kamu benar

// Ambil semua riwayat transaksi dengan detail barang dan user
const getRiwayatTransaksi = (req, res) => {
    const sql = `
        SELECT 
            t.id_transaksi, 
            t.tipe, 
            t.jumlah, 
            t.tanggal, 
            t.keterangan, 
            b.nama AS nama_barang, 
            u.username AS petugas
        FROM transaksi_stok t
        JOIN barang b ON t.id_barang = b.id_barang
        JOIN users u ON t.id_user = u.id_user
        ORDER BY t.tanggal DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

// Opsional: Ambil laporan berdasarkan tipe (IN atau OUT)
const getLaporanByTipe = (req, res) => {
    const { tipe } = req.params;
    const sql = "SELECT * FROM transaksi_stok WHERE tipe = ?";
    
    db.query(sql, [tipe], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

module.exports = {
    getRiwayatTransaksi,
    getLaporanByTipe
};