const db = require("../config/db");

exports.getDashboard = async (req, res) => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM barang) AS total_barang,
      (SELECT COUNT(*) FROM kategori) AS total_kategori,
      (SELECT COUNT(*) FROM transaksi_stok) AS total_transaksi,
      (SELECT COUNT(*) FROM outlet) AS total_outlet,
      (SELECT COUNT(*) FROM supplier) AS total_supplier
  `;

  try {
    const [result] = await db.query(query);

    const data = result?.[0] || {};

    res.status(200).json({
      message: "Dashboard data berhasil diambil",
      data: {
        total_barang: data.total_barang || 0,
        total_kategori: data.total_kategori || 0,
        total_transaksi: data.total_transaksi || 0,
        total_outlet: data.total_outlet || 0,
        total_supplier: data.total_supplier || 0,
      },
    });

  } catch (err) {
    console.error("[DASHBOARD ERROR]:", err.message);
    res.status(500).json({ 
      error: "Gagal mengambil data dashboard",
      details: err.message 
    });
  }
};