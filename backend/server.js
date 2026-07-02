const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./config/db");
const multer = require("multer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Middleware Global untuk Update Aktivitas
app.use(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.decode(token);
      if (decoded && decoded.id) {
        // Pastikan tabel users memiliki kolom last_seen
        await db.query("UPDATE users SET last_seen = NOW() WHERE id_user = ?", [decoded.id]);
      }
    } catch (e) {
      console.error("Middleware Error:", e.message);
    }
  }
  next();
});

// 2. Fungsi Seed User
// const seedUsers = async () => {
//   const users = [
//     { username: "bima", password: "password123", role: "admin" },
//     { username: "staff_gudang", password: "staff123", role: "staff" },
//   ];
//   try {
//     for (const u of users) {
//       const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [u.username]);
//       if (rows.length === 0) {
//         const hashedPassword = await bcrypt.hash(u.password, 10);
//         await db.query("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", 
//                        [u.username, hashedPassword, u.role]);
//         console.log(`✅ User otomatis dibuat: ${u.username}`);
//       }
//     }
//   } catch (err) {
//     console.error("❌ Gagal seeding users:", err.message);
//   }
// };
// seedUsers();

// 3. Static Files
app.use("/uploads", express.static("uploads"));

// 4. Routes (Diimpor dan digunakan hanya SATU KALI)
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboardRoutes");
const transaksiRoutes = require("./routes/transaksiRoutes");
const riwayatRoutes = require("./routes/riwayatRoutes");
const barangRoutes = require("./routes/barangRoutes");
const outletRoutes = require("./routes/outletRoutes");
const rakRoutes = require("./routes/rakRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/transaksi", transaksiRoutes);
app.use("/api/riwayat", riwayatRoutes);
app.use("/api/barang", barangRoutes);
app.use("/api/outlet", outletRoutes);
app.use("/api/rak", rakRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/users", userRoutes);

// 5. Global Error Handler (Paling bawah)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload Error: ${err.message}` });
  }
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