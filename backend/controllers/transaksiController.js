const db = require('../config/db');

// Fungsi utama untuk mencatat transaksi masuk dan keluar
const createTransaksi = (req, res) => {
    const { id_barang, tipe, jumlah, keterangan, id_user, id_supplier, id_outlet } = req.body;

    // 1. Validasi awal
    if (!id_barang || !tipe || !jumlah || !id_user) {
        return res.status(400).json({ message: "Semua data wajib diisi!" });
    }

    // 2. Logic Bisnis: IN harus ada Supplier, OUT harus ada Outlet
    if (tipe === 'IN' && !id_supplier) {
        return res.status(400).json({ message: "Barang MASUK wajib mencantumkan Supplier!" });
    }
    if (tipe === 'OUT' && !id_outlet) {
        return res.status(400).json({ message: "Barang KELUAR wajib mencantumkan Outlet tujuan!" });
    }

    // 3. Mulai Transaksi Database
    db.beginTransaction((err) => {
        if (err) throw err;

        // A. Insert ke tabel transaksi_stok
        const sqlInsert = `INSERT INTO transaksi_stok 
            (id_barang, tipe, jumlah, keterangan, id_user, id_supplier, id_outlet, tanggal) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
        
        const values = [
            id_barang, 
            tipe, 
            jumlah, 
            keterangan, 
            id_user, 
            tipe === 'IN' ? id_supplier : null, 
            tipe === 'OUT' ? id_outlet : null
        ];

        db.query(sqlInsert, values, (err, result) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ message: "Gagal mencatat transaksi", error: err.message });
                });
            }

            // B. Update Stok di tabel barang
            let sqlUpdateStok = "";
            if (tipe === 'IN') {
                sqlUpdateStok = "UPDATE barang SET stok = stok + ? WHERE id_barang = ?";
            } else {
                sqlUpdateStok = "UPDATE barang SET stok = stok - ? WHERE id_barang = ?";
            }

            db.query(sqlUpdateStok, [jumlah, id_barang], (err, resultUpdate) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ message: "Gagal update stok barang", error: err.message });
                    });
                }

                // C. Selesai dan Simpan Permanen (Commit)
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ message: "Gagal commit transaksi" });
                        });
                    }
                    res.json({ 
                        status: "Success", 
                        message: `Transaksi ${tipe} berhasil dicatat dan stok telah diperbarui.` 
                    });
                });
            });
        });
    });
};

module.exports = { createTransaksi };