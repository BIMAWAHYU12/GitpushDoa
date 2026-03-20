const db = require("../config/db");


// ================= RAK =================

// GET
const getRak = (req, res) => {
  db.query("SELECT * FROM rak", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

// POST
const createRak = (req, res) => {
  const { nama_rak } = req.body;

  if (!nama_rak) {
    return res.status(400).json({ message: "Nama rak wajib diisi" });
  }

  db.query(
    "INSERT INTO rak (nama_rak) VALUES (?)",
    [nama_rak],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Rak berhasil ditambahkan" });
    }
  );
};

// UPDATE
const updateRak = (req, res) => {
  const { id } = req.params;
  const { nama_rak } = req.body;

  db.query(
    "UPDATE rak SET nama_rak = ? WHERE id = ?",
    [nama_rak, id],
    (err, result) => {
      if (err) return res.status(500).send(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Rak tidak ditemukan" });
      }

      res.json({ message: "Rak berhasil diupdate" });
    }
  );
};

// DELETE
const deleteRak = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM rak WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rak tidak ditemukan" });
    }

    res.json({ message: "Rak berhasil dihapus" });
  });
};


// ================= SUPPLIER =================

const getSupplier = (req, res) => {
  db.query("SELECT * FROM supplier", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

const createSupplier = (req, res) => {
  const { nama_supplier } = req.body;

  db.query(
    "INSERT INTO supplier (nama_supplier) VALUES (?)",
    [nama_supplier],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Supplier berhasil ditambahkan" });
    }
  );
};

const updateSupplier = (req, res) => {
  const { id } = req.params;
  const { nama_supplier } = req.body;

  db.query(
    "UPDATE supplier SET nama_supplier = ? WHERE id = ?",
    [nama_supplier, id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Supplier berhasil diupdate" });
    }
  );
};

const deleteSupplier = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM supplier WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Supplier berhasil dihapus" });
  });
};


// ================= OUTLET =================

const getOutlet = (req, res) => {
  db.query("SELECT * FROM outlet", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

const createOutlet = (req, res) => {
  const { nama_outlet } = req.body;

  db.query(
    "INSERT INTO outlet (nama_outlet) VALUES (?)",
    [nama_outlet],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Outlet berhasil ditambahkan" });
    }
  );
};

const updateOutlet = (req, res) => {
  const { id } = req.params;
  const { nama_outlet } = req.body;

  db.query(
    "UPDATE outlet SET nama_outlet = ? WHERE id = ?",
    [nama_outlet, id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Outlet berhasil diupdate" });
    }
  );
};

const deleteOutlet = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM outlet WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Outlet berhasil dihapus" });
  });
};

module.exports = {
  getRak,
  createRak,
  updateRak,
  deleteRak,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getOutlet,
  createOutlet,
  updateOutlet,
  deleteOutlet,
};