const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

const { verifyToken } = require("../middleware/authMiddleware");
const { createTransaksi, createBulkTransaksi } = require("../controllers/transaksiController");

router.post("/", verifyToken, createTransaksi);

router.post("/bulk", verifyToken, upload.single("bukti_foto"), createBulkTransaksi);

module.exports = router;