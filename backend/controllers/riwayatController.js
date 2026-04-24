const db = require('../config/db');

// Mengambil riwayat transaksi lengkap dengan JOIN multi-tabel
const getRiwayatLengkap = async (req, res) => {
    const sql = `
        SELECT 
            t.id_transaksi,
            t.tanggal,
            t.tipe,
            t.jumlah,
            t.keterangan,
            b.nama AS nama_barang,
            u.username AS nama_petugas,
            s.nama_supplier AS asal_supplier,
            o.nama_outlet AS tujuan_outlet
        FROM transaksi_stok t
        JOIN barang b ON t.id_barang = b.id_barang
        JOIN users u ON t.id_user = u.id_user
        LEFT JOIN supplier s ON t.id_supplier = s.id_supplier
        LEFT JOIN outlet o ON t.id_outlet = o.id_outlet
        ORDER BY t.tanggal DESC
    `;

    try {
        const [results] = await db.query(sql);
        res.json({
            status: "Success",
            data: results
        });
    } catch (err) {
        console.error("[RIWAYAT ERROR]:", err.message);
        res.status(500).json({ 
            message: "Gagal mengambil data riwayat", 
            error: err.message 
        });
    }
};

module.exports = { getRiwayatLengkap };