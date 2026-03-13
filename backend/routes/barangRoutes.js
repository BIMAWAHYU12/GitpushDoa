const express = require("express");
const router = express.Router();
const { getBarang, getKategori } = require("../controllers/barangController");

router.get("/barang", getBarang);

router.get("/kategori", getKategori);

router.get("/test", (req, res) => res.send("API Berhasil Konek!"));

module.exports = router;