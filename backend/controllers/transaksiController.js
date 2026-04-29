const db = require('../config/db');

const createTransaksi = async (req, res) => {
    const { id_barang, tipe, jumlah, keterangan, id_user, id_supplier, id_outlet } = req.body;
    
    const qty = parseInt(jumlah);

    if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({ message: "Jumlah harus angka dan lebih dari 0!" });
    }

    if (!id_barang || !tipe || !id_user) {
        return res.status(400).json({ message: "Data utama wajib diisi dengan benar!" });
    }

    if (!['IN', 'OUT'].includes(tipe)) {
        return res.status(400).json({ message: "Tipe transaksi harus IN atau OUT!" });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [cekBarang] = await connection.query(
            "SELECT nama, stok, gambar FROM barang WHERE id_barang = ?", 
            [id_barang]
        );

        if (cekBarang.length === 0) {
            throw new Error("Barang tidak ditemukan di sistem!");
        }

        const namaBarang = cekBarang[0].nama;
        const stokSekarang = cekBarang[0].stok;

        if (tipe === 'IN' && !id_supplier) {
            throw new Error("Barang MASUK wajib mencantumkan Supplier!");
        }
        
        if (tipe === 'OUT') {
            if (!id_outlet) throw new Error("Barang KELUAR wajib mencantumkan Outlet!");
            
            if (stokSekarang < qty) {
                throw new Error(`Stok tidak cukup! Sisa stok ${namaBarang}: ${stokSekarang}`);
            }
        }

        const sqlInsert = `INSERT INTO transaksi_stok 
            (id_barang, tipe, jumlah, keterangan, id_user, id_supplier, id_outlet, tanggal) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
        
        const values = [
            id_barang, tipe, qty, keterangan || null, id_user, 
            tipe === 'IN' ? id_supplier : null, 
            tipe === 'OUT' ? id_outlet : null
        ];

        await connection.query(sqlInsert, values);

        const sqlUpdateStok = tipe === 'IN' 
            ? "UPDATE barang SET stok = stok + ? WHERE id_barang = ?" 
            : "UPDATE barang SET stok = stok - ? WHERE id_barang = ?";

        await connection.query(sqlUpdateStok, [qty, id_barang]);

        await connection.commit();

        res.status(201).json({ 
            status: "Success", 
            message: `Transaksi ${tipe} untuk ${namaBarang} berhasil!`,
            detail: {
                barang: namaBarang,
                sisa_stok: tipe === 'IN' ? stokSekarang + qty : stokSekarang - qty,
                gambar: cekBarang[0].gambar
            }
        });

    } catch (err) {
        await connection.rollback();
        console.error("[TRANSAKSI ERROR]:", err.message);

        let pesanCustom = err.message;
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            pesanCustom = "Gagal: ID Supplier atau ID Outlet tidak ditemukan di database!";
        }

        const statusCode = err.code ? 400 : 500;

        res.status(statusCode).json({ 
            message: "Transaksi Gagal", 
            error: pesanCustom 
        });

    } finally {
        connection.release();
    }
};

module.exports = { createTransaksi };