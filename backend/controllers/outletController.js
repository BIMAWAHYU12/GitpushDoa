const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// 1. Get All Outlet
const getOutlet = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM outlet ORDER BY id_outlet DESC");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Create Outlet (Menyimpan Nama, Alamat, Kontak & File Gambar)
const createOutlet = async (req, res) => {
  const { nama_outlet, alamat, kontak } = req.body;
  const gambar = req.file ? req.file.filename : null; 

  if (!nama_outlet || !alamat || !kontak) {
    return res.status(400).json({ message: "Nama, Alamat, dan Kontak outlet wajib diisi!" });
  }

  try {
    const query = "INSERT INTO outlet (nama_outlet, alamat, kontak, gambar) VALUES (?, ?, ?, ?)";
    await db.query(query, [nama_outlet, alamat, kontak, gambar]);
    
    res.status(201).json({ message: "Outlet baru berhasil ditambahkan!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Update Outlet (Pengaman File Fisik Ganti Foto & Anti-Crash Eror 500)
const updateOutlet = async (req, res) => {
  const { id } = req.params;
  const { nama_outlet, alamat, kontak } = req.body;

  if (!nama_outlet || !alamat || !kontak) {
    return res.status(400).json({ message: "Nama, Alamat, dan Kontak outlet wajib diisi!" });
  }

  try {
    // Ambil data lama buat ngecek file foto sebelum dihapus fisik
    const [cek] = await db.query("SELECT * FROM outlet WHERE id_outlet = ?", [id]);
    if (cek.length === 0) return res.status(404).json({ message: "Outlet tidak ditemukan" });
    
    const outletLama = cek[0];
    let query, params;

    // JIKA USER UPLOAD FOTO BARU PAS EDIT
    if (req.file) {
      // Hapus file lama dari folder uploads hanya jika filenya beneran eksis di server
      if (outletLama.gambar && outletLama.gambar !== "NULL") {
        const oldPath = path.join(__dirname, "../uploads/", outletLama.gambar);
        try {
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (fsErr) {
          console.log("[FS LOG] File fisik lama tidak ada, abaikan dan lanjut.");
        }
      }

      query = "UPDATE outlet SET nama_outlet = ?, alamat = ?, kontak = ?, gambar = ? WHERE id_outlet = ?";
      params = [nama_outlet, alamat, kontak, req.file.filename, id];
    } else {
      // JIKA USER HANYA EDIT TEKS TANPA GANTI FOTO
      query = "UPDATE outlet SET nama_outlet = ?, alamat = ?, kontak = ? WHERE id_outlet = ?";
      params = [nama_outlet, alamat, kontak, id];
    }

    await db.query(query, params);
    res.json({ message: "Outlet berhasil diperbarui!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Delete Outlet (Hapus Baris Sekaligus File Fotonya)
const deleteOutlet = async (req, res) => {
  const { id } = req.params;
  try {
    const [cek] = await db.query("SELECT gambar FROM outlet WHERE id_outlet = ?", [id]);
    if (cek.length === 0) return res.status(404).json({ message: "Outlet tidak ditemukan" });

    if (cek[0].gambar) {
      const filePath = path.join(__dirname, "../uploads/", cek[0].gambar);
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (fsErr) {
        console.log("[FS LOG] Gagal bersihkan sisa foto.");
      }
    }

    const [result] = await db.query("DELETE FROM outlet WHERE id_outlet = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Outlet tidak ditemukan" });
    res.json({ message: "Outlet berhasil dihapus!" });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({ message: "Outlet tidak bisa dihapus karena masih digunakan!" });
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getOutlet, createOutlet, updateOutlet, deleteOutlet };