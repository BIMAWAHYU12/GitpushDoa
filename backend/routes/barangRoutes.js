const express = require("express");
const router = express.Router();

// BARANG
const {
  getBarang,
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
router.get("/barang", getBarang);
router.post("/barang", createBarang);
router.put("/barang/:id", updateBarang);
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