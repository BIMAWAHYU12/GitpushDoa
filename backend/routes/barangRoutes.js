const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const { getAllBarang, createBarang, updateBarang, deleteBarang } = require("../controllers/barangController");
const upload = require("../middleware/uploadMiddleware"); 

router.get("/", verifyToken, getAllBarang); // 
router.post("/", verifyToken, isAdmin, upload.single("gambar"), createBarang);
router.put("/:id", verifyToken, isAdmin, upload.single("gambar"), updateBarang);
router.delete("/:id", verifyToken, isAdmin, deleteBarang);

module.exports = router;