const db = require('../config/db');

// ==========================================
// 1. FUNGSI LAMA (Single Transaksi)
// Tetap dibiarkan agar tidak merusak fitur lain yang mungkin masih pakai endpoint ini
// ==========================================
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

        // Insert riwayat stok
        const sqlInsert = `INSERT INTO transaksi_stok 
            (id_barang, tipe, jumlah, keterangan, id_user, id_supplier, id_outlet, tanggal) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
        
        const values = [
            id_barang, tipe, qty, keterangan || null, id_user, 
            tipe === 'IN' ? id_supplier : null, 
            tipe === 'OUT' ? id_outlet : null
        ];

        await connection.query(sqlInsert, values);

        // Update Stok
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

// ==========================================
// 2. FUNGSI BARU (Bulk / Keranjang + Bukti Foto + Audit)
// ==========================================
const createBulkTransaksi = async (req, res) => {
    // Tangkap data dari FormData
    const { tipe, keterangan, id_user, id_supplier, id_outlet, items } = req.body;
    
    // Tangkap nama file foto jika diupload
    const bukti_foto = req.file ? req.file.filename : null; 

    // Parse items karena dikirim sebagai stringified JSON dari FormData
    let parsedItems = [];
    try {
        parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    } catch (e) {
        return res.status(400).json({ message: "Format keranjang barang tidak valid!" });
    }

    // --- VALIDASI DASAR ---
    if (!parsedItems || parsedItems.length === 0) {
        return res.status(400).json({ message: "Keranjang barang tidak boleh kosong!" });
    }
    if (!id_user || !tipe) {
        return res.status(400).json({ message: "ID User dan Tipe Transaksi wajib diisi!" });
    }
    if (!['IN', 'OUT'].includes(tipe)) {
        return res.status(400).json({ message: "Tipe transaksi harus IN atau OUT!" });
    }
    if (tipe === 'IN' && !id_supplier) {
        return res.status(400).json({ message: "Transaksi MASUK wajib mencantumkan Supplier!" });
    }
    
    // 🔥 VALIDASI KELUAR VS AUDIT: Boleh tanpa Outlet JIKA ada tag [AUDIT STOK] di keterangan
    const isAuditMode = tipe === 'OUT' && keterangan && keterangan.includes('[AUDIT STOK]');
    if (tipe === 'OUT' && !id_outlet && !isAuditMode) {
        return res.status(400).json({ message: "Transaksi KELUAR wajib mencantumkan Outlet (Kecuali Mode Audit)!" });
    }

    const connection = await db.getConnection();

    try {
        // Mulai proteksi Database Transaction
        await connection.beginTransaction();

        // Looping setiap barang yang ada di keranjang
        for (const item of parsedItems) {
            const qty = parseInt(item.jumlah);

            if (isNaN(qty) || qty <= 0) {
                throw new Error(`Jumlah barang untuk ID ${item.id_barang} tidak valid!`);
            }

            // Lock row sementara (FOR UPDATE) agar data konsisten saat diakses bersamaan
            const [cekBarang] = await connection.query(
                "SELECT nama, stok FROM barang WHERE id_barang = ? FOR UPDATE", 
                [item.id_barang]
            );

            if (cekBarang.length === 0) {
                throw new Error(`Barang dengan ID ${item.id_barang} tidak ditemukan!`);
            }

            const namaBarang = cekBarang[0].nama;
            const stokSekarang = cekBarang[0].stok;

            // Pengecekan sisa stok jika barang Keluar / Audit
            if (tipe === 'OUT' && stokSekarang < qty) {
                throw new Error(`Stok tidak cukup! Sisa stok ${namaBarang}: ${stokSekarang}`);
            }

            // 1. Insert riwayat ke tabel transaksi_stok
            const sqlInsert = `INSERT INTO transaksi_stok 
                (id_barang, tipe, jumlah, keterangan, id_user, id_supplier, id_outlet, tanggal, bukti_foto) 
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`;
            
            const values = [
                item.id_barang, 
                tipe, 
                qty, 
                keterangan || null, 
                id_user, 
                tipe === 'IN' ? id_supplier : null, 
                isAuditMode ? null : (tipe === 'OUT' ? id_outlet : null), // Kosongkan id_outlet jika mode Audit
                bukti_foto
            ];

            await connection.query(sqlInsert, values);

            // 2. Update Master Stok Barang
            const sqlUpdateStok = tipe === 'IN' 
                ? "UPDATE barang SET stok = stok + ? WHERE id_barang = ?" 
                : "UPDATE barang SET stok = stok - ? WHERE id_barang = ?";

            await connection.query(sqlUpdateStok, [qty, item.id_barang]);
        }

        // Jika semua looping aman dan sukses, simpan secara permanen
        await connection.commit();

        res.status(201).json({ 
            status: "Success", 
            message: `Mutasi ${tipe} untuk ${parsedItems.length} item berhasil dicatat!`
        });

    } catch (err) {
        // 🔴 BATALKAN SEMUA PERUBAHAN JIKA ADA 1 SAJA ERROR
        await connection.rollback();
        console.error("[BULK TRANSAKSI ERROR]:", err.message);

        let pesanCustom = err.message;
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            pesanCustom = "Gagal: ID Supplier atau ID Outlet tidak ditemukan di database!";
        }

        res.status(400).json({ 
            message: "Transaksi Batal", 
            error: pesanCustom 
        });

    } finally {
        connection.release();
    }
};

module.exports = { 
    createTransaksi,
    createBulkTransaksi 
};