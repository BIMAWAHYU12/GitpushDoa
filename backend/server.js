const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // Untuk nge-hash password otomatis
const db = require("./config/db"); // Import koneksi db
const multer = require("multer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const seedUsers = async () => {
  const users = [
    { username: "bima", password: "password123", role: "admin" },
    { username: "staff_gudang", password: "staff123", role: "staff" },
  ];

  try {
    for (const u of users) {
      const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
        u.username,
      ]);
      if (rows.length === 0) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await db.query(
          "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
          [u.username, hashedPassword, u.role]
        );
        console.log(`✅ User ${u.role} otomatis dibuat: ${u.username}`);
      }
    }
  } catch (err) {
    console.error("❌ Gagal seeding users:", err.message);
  }
};

seedUsers();

// ==================== 🚀 UTILITY & STATIC ROUTES ====================
app.use("/uploads", express.static("uploads"));

// ==================== 🛣️ CLEAN ROUTING MODULES ====================

// --- AUTHENTICATION ---
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// --- CORE SYSTEM & LOGISTICS ---
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api", dashboardRoutes);

const transaksiRoutes = require("./routes/transaksiRoutes");
app.use("/api/transaksi", transaksiRoutes);

const riwayatRoutes = require("./routes/riwayatRoutes");
app.use("/api/riwayat", riwayatRoutes);


// --- 🔥 MASTER DATA INDEPENDEN (RESTful Best Practice) ---

// 📦 Jalur Master Barang
const barangRoutes = require("./routes/barangRoutes");
app.use("/api/barang", barangRoutes);

// 🏪 Jalur Master Outlet (Membaca file outletRoutes.js baru)
const outletRoutes = require("./routes/outletRoutes");
app.use("/api/outlet", outletRoutes);

// 📍 Jalur Master Rak (Membaca file rakRoutes.js baru)
const rakRoutes = require("./routes/rakRoutes");
app.use("/api/rak", rakRoutes);

// 🤝 Jalur Master Supplier (Membaca file supplierRoutes.js baru)
const supplierRoutes = require("./routes/supplierRoutes");
app.use("/api/supplier", supplierRoutes);


// ==================== 🛠️ GLOBAL ERROR HANDLER ====================
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload Error: ${err.message}` });
  }

  if (err.message === "Format file harus JPG/JPEG/PNG") {
    return res.status(400).json({ message: err.message });
  }

  // Error internal lainnya
  console.error(err.stack);
  res.status(500).json({
    message: "Terjadi kesalahan pada server",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server iGUDANG Engine jalan di port ${PORT}`);
});