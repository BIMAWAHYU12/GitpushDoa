const db = require("../config/db");

const getBarang = (req, res) => {
  db.query("SELECT * FROM barang", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

const getKategori = (req, res) => {
  db.query("SELECT * FROM kategori", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

module.exports = { getBarang, getKategori };