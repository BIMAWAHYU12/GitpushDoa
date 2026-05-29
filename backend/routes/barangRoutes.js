const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// 🔥 FIX: Ubah getBarang menjadi getAllBarang biar sinkron dengan nama di file controller lu!
const { getAllBarang, createBarang, updateBarang, deleteBarang } = require("../controllers/barangController");
const upload = require("../middleware/uploadMiddleware"); 

// Jalur Eksklusif Master Barang
router.get("/", verifyToken, getAllBarang); // <-- Diubah juga di sini
router.post("/", verifyToken, isAdmin, upload.single("gambar"), createBarang);
router.put("/:id", verifyToken, isAdmin, upload.single("gambar"), updateBarang);
router.delete("/:id", verifyToken, isAdmin, deleteBarang);

module.exports = router;