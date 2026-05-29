const db = require("../config/db");

// 1. Get All Outlet
const getOutlet = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM outlet ORDER BY id_outlet DESC");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Create Outlet
const createOutlet = async (req, res) => {
  const { nama_outlet, lokasi_outlet } = req.body;

  if (!nama_outlet || !lokasi_outlet) {
    return res.status(400).json({ message: "Nama dan Wilayah/Lokasi outlet wajib diisi!" });
  }

  try {
    await db.query("INSERT INTO outlet (nama_outlet, lokasi_outlet) VALUES (?, ?)", [nama_outlet, lokasi_outlet]);
    res.status(201).json({ message: "Outlet berhasil ditambahkan!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Update Outlet
const updateOutlet = async (req, res) => {
  const { id } = req.params;
  const { nama_outlet, lokasi_outlet } = req.body;

  if (!nama_outlet || !lokasi_outlet) {
    return res.status(400).json({ message: "Nama dan Lokasi outlet wajib diisi!" });
  }

  try {
    const [result] = await db.query(
      "UPDATE outlet SET nama_outlet = ?, lokasi_outlet = ? WHERE id_outlet = ?",
      [nama_outlet, lokasi_outlet, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Outlet tidak ditemukan" });
    res.json({ message: "Outlet berhasil diperbarui!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Delete Outlet
const deleteOutlet = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM outlet WHERE id_outlet = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Outlet tidak ditemukan" });
    res.json({ message: "Outlet berhasil dihapus!" });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({ message: "Outlet tidak bisa dihapus karena masih digunakan dalam data logistik!" });
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getOutlet, createOutlet, updateOutlet, deleteOutlet };