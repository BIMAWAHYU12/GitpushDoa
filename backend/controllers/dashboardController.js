const db = require("../config/db");

exports.getDashboard = async (req, res) => { // Tambahin 'async'
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM barang) AS total_barang,
      (SELECT COUNT(*) FROM kategori) AS total_kategori,
      (SELECT COUNT(*) FROM transaksi_stok) AS total_transaksi,
      (SELECT COUNT(*) FROM outlet) AS total_outlet,
      (SELECT COUNT(*) FROM supplier) AS total_supplier
  `;

  try {
    // Pake await karena db.js pake .promise()
    // Hasilnya kita pecah (destructure) jadi [result]
    const [result] = await db.query(query);

    res.status(200).json({
      message: "Dashboard data berhasil diambil",
      data: result[0],
    });

  } catch (err) {
    // Error handling buat jaga-jaga kalau ada tabel yang belum dibuat
    console.error("[DASHBOARD ERROR]:", err.message);
    res.status(500).json({ 
      error: "Gagal mengambil data dashboard",
      details: err.message 
    });
  }
};