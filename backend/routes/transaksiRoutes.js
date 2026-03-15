const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');

// Endpoint untuk mendapatkan semua riwayat
router.get('/riwayat', transaksiController.getRiwayatTransaksi);

// Endpoint untuk filter berdasarkan tipe (IN/OUT)
router.get('/laporan/:tipe', transaksiController.getLaporanByTipe);

module.exports = router;