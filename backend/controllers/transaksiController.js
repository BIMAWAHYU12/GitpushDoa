const db = require('../config/db');

const createTransaksi = async (req, res) => {
    // 1. Destructuring & Parsing data
    const { id_barang, tipe, jumlah, keterangan, id_user, id_supplier, id_outlet } = req.body;
    const qty = parseInt(jumlah); 

    if (qty <= 0) return res.status(400).json({ message: "Jumlah harus lebih dari 0!" });
    // 2. Validasi awal (Client Error)
    if (!id_barang || !tipe || isNaN(qty) || !id_user) {
        return res.status(400).json({ message: "Data utama wajib diisi dengan benar!" });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 3. CEK: Apakah barangnya ada? (Kolom disesuaikan: 'nama')
        const [cekBarang] = await connection.query(
            "SELECT nama, stok, gambar FROM barang WHERE id_barang = ?", 
            [id_barang]
        );

        if (cekBarang.length === 0) {
            throw new Error("Barang tidak ditemukan di sistem!");
        }

        const namaBarang = cekBarang[0].nama;
        const stokSekarang = cekBarang[0].stok;

        // 4. Logic Bisnis: IN (Supplier) / OUT (Outlet & Cek Stok)
        if (tipe === 'IN' && !id_supplier) {
            throw new Error("Barang MASUK wajib mencantumkan Supplier!");
        }
        
        if (tipe === 'OUT') {
            if (!id_outlet) throw new Error("Barang KELUAR wajib mencantumkan Outlet!");
            
            if (stokSekarang < qty) {
                throw new Error(`Stok tidak cukup! Sisa stok ${namaBarang}: ${stokSekarang}`);
            }
        }

        // 5. INSERT ke tabel transaksi_stok
        const sqlInsert = `INSERT INTO transaksi_stok 
            (id_barang, tipe, jumlah, keterangan, id_user, id_supplier, id_outlet, tanggal) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
        
        const values = [
            id_barang, tipe, qty, keterangan || null, id_user, 
            tipe === 'IN' ? id_supplier : null, 
            tipe === 'OUT' ? id_outlet : null
        ];

        await connection.query(sqlInsert, values);

        // 6. UPDATE Stok di tabel barang
        const sqlUpdateStok = tipe === 'IN' 
            ? "UPDATE barang SET stok = stok + ? WHERE id_barang = ?" 
            : "UPDATE barang SET stok = stok - ? WHERE id_barang = ?";

        await connection.query(sqlUpdateStok, [qty, id_barang]);

        // 7. COMMIT (Simpan Permanen)
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

    // Cek kalau error-nya karena Foreign Key
    let pesanCustom = err.message;
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        pesanCustom = "Gagal: ID Supplier atau ID Outlet tidak ditemukan di database!";
    }

    res.status(400).json({ 
        message: "Transaksi Gagal", 
        error: pesanCustom 
    });

    } finally {
        // Lepas koneksi kembali ke pool
        connection.release();
    }
};

module.exports = { createTransaksi };