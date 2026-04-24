const express = require('express');
const router = express.Router();
const { createTransaksi } = require('../controllers/transaksiController');

router.post('/transaksi', createTransaksi);

module.exports = router;