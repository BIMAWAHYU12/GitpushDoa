const db = require('../config/db');

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
            COALESCE(s.nama_supplier, '-') AS asal_supplier,
            COALESCE(o.nama_outlet, '-') AS tujuan_outlet
        FROM transaksi_stok t
        JOIN barang b ON t.id_barang = b.id_barang
        JOIN users u ON t.id_user = u.id_user
        LEFT JOIN supplier s ON t.id_supplier = s.id_supplier
        LEFT JOIN outlet o ON t.id_outlet = o.id_outlet
        ORDER BY t.tanggal DESC
    `;

    try {
        const [results] = await db.query(sql);

        res.status(200).json({
            status: "Success",
            total: results.length,
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