const db = require("../config/db");

// ================= RAK =================
const getRak = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM rak");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createRak = async (req, res) => {
  const { nama_rak } = req.body;
  if (!nama_rak) return res.status(400).json({ message: "Nama rak wajib diisi" });
  try {
    await db.query("INSERT INTO rak (nama_rak) VALUES (?)", [nama_rak]);
    res.status(201).json({ message: "Rak berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateRak = async (req, res) => {
  const { id } = req.params;
  const { nama_rak } = req.body;
  if (!nama_rak) return res.status(400).json({ message: "Nama baru wajib diisi" });
  try {
    const [result] = await db.query("UPDATE rak SET nama_rak = ? WHERE id_rak = ?", [nama_rak, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Rak tidak ditemukan" });
    res.json({ message: "Rak berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteRak = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM rak WHERE id_rak = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Rak tidak ditemukan" });
    res.json({ message: "Rak berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= SUPPLIER =================
const getSupplier = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM supplier");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createSupplier = async (req, res) => {
  const { nama_supplier } = req.body;
  if (!nama_supplier) return res.status(400).json({ message: "Nama supplier wajib diisi" });
  try {
    await db.query("INSERT INTO supplier (nama_supplier) VALUES (?)", [nama_supplier]);
    res.status(201).json({ message: "Supplier berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { nama_supplier } = req.body;
  try {
    const [result] = await db.query("UPDATE supplier SET nama_supplier = ? WHERE id_supplier = ?", [nama_supplier, id]);
    // CEGAT ERROR DI SINI
    if (result.affectedRows === 0) return res.status(404).json({ message: "Supplier tidak ditemukan" });
    res.json({ message: "Supplier berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM supplier WHERE id_supplier = ?", [id]);
    // CEGAT ERROR DI SINI
    if (result.affectedRows === 0) return res.status(404).json({ message: "Supplier tidak ditemukan" });
    res.json({ message: "Supplier berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= OUTLET =================
const getOutlet = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM outlet");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createOutlet = async (req, res) => {
  const { nama_outlet } = req.body;
  if (!nama_outlet) return res.status(400).json({ message: "Nama outlet wajib diisi" });
  try {
    await db.query("INSERT INTO outlet (nama_outlet) VALUES (?)", [nama_outlet]);
    res.status(201).json({ message: "Outlet berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOutlet = async (req, res) => {
  const { id } = req.params;
  const { nama_outlet } = req.body;
  try {
    const [result] = await db.query("UPDATE outlet SET nama_outlet = ? WHERE id_outlet = ?", [nama_outlet, id]);
    // CEGAT ERROR DI SINI
    if (result.affectedRows === 0) return res.status(404).json({ message: "Outlet tidak ditemukan" });
    res.json({ message: "Outlet berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteOutlet = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM outlet WHERE id_outlet = ?", [id]);
    // CEGAT ERROR DI SINI
    if (result.affectedRows === 0) return res.status(404).json({ message: "Outlet tidak ditemukan" });
    res.json({ message: "Outlet berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getRak, createRak, updateRak, deleteRak,
  getSupplier, createSupplier, updateSupplier, deleteSupplier,
  getOutlet, createOutlet, updateOutlet, deleteOutlet,
};