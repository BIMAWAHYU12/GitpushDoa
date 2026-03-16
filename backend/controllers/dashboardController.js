const db = require("../config/db");

exports.getDashboard = (req, res) => {
    const query = `
        SELECT
        (SELECT COUNT(*) FROM barang) AS total_barang,
        (SELECT COUNT(*) FROM kategori) AS total_kategori,
        (SELECT COUNT(*) FROM transaksi_stok) AS total_transaksi,
        (SELECT COUNT(*) FROM outlet) AS total_outlet,
        (SELECT COUNT(*) FROM supplier) AS total_supplier
    `;

    db.query(query, (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(result);
        }
    });
};