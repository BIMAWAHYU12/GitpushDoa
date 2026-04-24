const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // Untuk nge-hash password otomatis
const db = require("./config/db"); // Import koneksi db lu
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const seedUsers = async () => {
  const users = [
    { username: "bima", password: "password123", role: "admin" },
    { username: "staff_gudang", password: "staff123", role: "staff" }
  ];

  try {
    for (const u of users) {
      const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [u.username]);
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
// --- ROUTES ---
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
// --- ROUTES ---
const dashboardRoutes = require("./routes/dashboardRoutes"); // 1. Import rute dashboard
app.use("/api", dashboardRoutes); 

const masterRoutes = require("./routes/barangRoutes"); // import route master data
app.use("/api", masterRoutes);

const transaksiRoutes = require("./routes/transaksiRoutes"); // 1. Import rute transaksi baru
app.use("/api", transaksiRoutes); // 2. Daftarkan rute transaksi

// Biar folder foto bisa diakses lewat URL browser/img tag
app.use('/uploads', express.static('uploads'));

const riwayatRoutes = require('./routes/riwayatRoutes'); //riwayat
app.use('/api/riwayat', riwayatRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server iGUDANG jalan di port ${PORT}`);
});