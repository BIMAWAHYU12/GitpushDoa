const db = require("../config/db");

// 1. Get All Supplier
const getSupplier = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM supplier ORDER BY id_supplier DESC");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Create Supplier
const createSupplier = async (req, res) => {
  const { nama_supplier, kontak, alamat } = req.body;
  if (!nama_supplier) return res.status(400).json({ message: "Nama mitra supplier wajib diisi!" });

  try {
    await db.query(
      "INSERT INTO supplier (nama_supplier, kontak, alamat) VALUES (?, ?, ?)",
      [nama_supplier, kontak || null, alamat || null]
    );
    res.status(201).json({ message: "Data mitra supplier berhasil didaftarkan!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Update Supplier
const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { nama_supplier, kontak, alamat } = req.body;
  if (!nama_supplier) return res.status(400).json({ message: "Nama supplier wajib diisi!" });

  try {
    const [result] = await db.query(
      "UPDATE supplier SET nama_supplier = ?, kontak = ?, alamat = ? WHERE id_supplier = ?",
      [nama_supplier, kontak || null, alamat || null, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Supplier tidak ditemukan" });
    res.json({ message: "Data supplier berhasil diperbarui!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Delete Supplier
const deleteSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM supplier WHERE id_supplier = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Supplier tidak ditemukan" });
    res.json({ message: "Data supplier berhasil dihapus!" });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({ message: "Supplier tidak bisa dihapus karena masih terikat riwayat pasokan stok!" });
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getSupplier, createSupplier, updateSupplier, deleteSupplier };