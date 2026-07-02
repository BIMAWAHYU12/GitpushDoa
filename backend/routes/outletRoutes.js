const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { getOutlet, createOutlet, updateOutlet, deleteOutlet } = require("../controllers/outletController");

// 🔥 PANGGIL MIDDLEWARE UPLOAD MULTER LU
const upload = require("../middleware/uploadMiddleware"); 

// Jalur Eksklusif Master Outlet
router.get("/", verifyToken, getOutlet);

// 🔥 SELIPKAN upload.single("gambar") pada method POST dan PUT
router.post("/", verifyToken, isAdmin, upload.single("gambar"), createOutlet);
router.put("/:id", verifyToken, isAdmin, upload.single("gambar"), updateOutlet);

router.delete("/:id", verifyToken, isAdmin, deleteOutlet);

module.exports = router;