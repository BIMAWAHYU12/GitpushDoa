const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { createTransaksi } = require("../controllers/transaksiController");

// semua boleh (asal login)
router.post("/", verifyToken, createTransaksi);

module.exports = router;