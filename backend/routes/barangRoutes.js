const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware"); // Middleware Multer

// BARANG
const {
  getAllBarang, // Kita sesuaikan nama fungsinya dengan controller terbaru
  createBarang,
  updateBarang,
  deleteBarang,
} = require("../controllers/barangController");

// MASTER DATA
const {
  getRak,
  createRak,
  updateRak,
  deleteRak,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getOutlet,
  createOutlet,
  updateOutlet,
  deleteOutlet,
} = require("../controllers/masterController");


// ===== BARANG =====
// Gunakan getAllBarang untuk dapet data Join (Nama Rak/Kategori) & URL Gambar
router.get("/barang", getAllBarang);

// Tambahkan middleware 'upload.single' untuk menghandle file gambar
router.post("/barang", upload.single('gambar'), createBarang);

// PUT juga dikasih upload.single biar user bisa ganti foto pas edit barang
router.put("/barang/:id", upload.single('gambar'), updateBarang);

router.delete("/barang/:id", deleteBarang);


// ===== RAK =====
router.get("/rak", getRak);
router.post("/rak", createRak);
router.put("/rak/:id", updateRak);
router.delete("/rak/:id", deleteRak);


// ===== SUPPLIER =====
router.get("/supplier", getSupplier);
router.post("/supplier", createSupplier);
router.put("/supplier/:id", updateSupplier);
router.delete("/supplier/:id", deleteSupplier);


// ===== OUTLET =====
router.get("/outlet", getOutlet);
router.post("/outlet", createOutlet);
router.put("/outlet/:id", updateOutlet);
router.delete("/outlet/:id", deleteOutlet);


// TEST
router.get("/test", (req, res) => res.send("API Berhasil Konek!"));

module.exports = router;