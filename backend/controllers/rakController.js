const db = require("../config/db");

// 1. Get All Rak
const getRak = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM rak ORDER BY id_rak DESC");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Create Rak
const createRak = async (req, res) => {
  const { nama_rak } = req.body;
  if (!nama_rak) return res.status(400).json({ message: "Nama rak lokasi wajib diisi!" });

  try {
    await db.query("INSERT INTO rak (nama_rak) VALUES (?)", [nama_rak]);
    res.status(201).json({ message: "Kode lokasi rak berhasil disimpan!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Update Rak
const updateRak = async (req, res) => {
  const { id } = req.params;
  const { nama_rak } = req.body;
  if (!nama_rak) return res.status(400).json({ message: "Nama rak baru wajib diisi!" });

  try {
    const [result] = await db.query("UPDATE rak SET nama_rak = ? WHERE id_rak = ?", [nama_rak, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Rak tidak ditemukan" });
    res.json({ message: "Informasi rak berhasil diperbarui!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Delete Rak
const deleteRak = async (req, res) => {
  const { id } = req.params;
  try {
    const [cek] = await db.query("SELECT COUNT(*) AS total FROM barang WHERE rak_id = ?", [id]);
    if (cek[0].total > 0) return res.status(400).json({ message: "Gagal! Rak masih berisi data barang aktif." });

    const [result] = await db.query("DELETE FROM rak WHERE id_rak = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Rak tidak ditemukan" });
    res.json({ message: "Lokasi rak berhasil dikosongkan/dihapus!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getRak, createRak, updateRak, deleteRak };