const db = require("../config/db");

// GET BARANG
const getBarang = (req, res) => {
  const sql = `
    SELECT barang.*, rak.nama_rak
    FROM barang
    JOIN rak ON barang.rak_id = rak.id_rak
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

// CREATE BARANG
const createBarang = (req, res) => {
  const { nama_barang, rak_id } = req.body;

  if (!nama_barang || !rak_id) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  const sql = "INSERT INTO barang (nama_barang, rak_id) VALUES (?, ?)";

  db.query(sql, [nama_barang, rak_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Barang berhasil ditambahkan" });
  });
};

// UPDATE BARANG
const updateBarang = (req, res) => {
  const { id } = req.params;
  const { nama_barang, rak_id } = req.body;

  const sql = "UPDATE barang SET nama_barang = ?, rak_id = ? WHERE id = ?";

  db.query(sql, [nama_barang, rak_id, id], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    res.json({ message: "Barang berhasil diupdate" });
  });
};

// DELETE BARANG
const deleteBarang = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM barang WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    res.json({ message: "Barang berhasil dihapus" });
  });
};

module.exports = {
  getBarang,
  createBarang,
  updateBarang,
  deleteBarang,
};