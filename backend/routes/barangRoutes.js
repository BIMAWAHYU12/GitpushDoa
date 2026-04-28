const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const {
  getAllBarang,
  createBarang,
  updateBarang,
  deleteBarang
} = require("../controllers/barangController");

// GET semua barang
router.get("/", verifyToken, getAllBarang);

// CREATE barang
router.post("/", verifyToken, isAdmin, upload.single("gambar"), createBarang);

// UPDATE barang
router.put("/:id", verifyToken, isAdmin, upload.single("gambar"), updateBarang);

// DELETE barang
router.delete("/:id", verifyToken, isAdmin, deleteBarang);

module.exports = router;