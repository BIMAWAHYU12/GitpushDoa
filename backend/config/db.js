const mysql = require("mysql2");
require("dotenv").config();

// Gunakan createPool supaya lebih stabil buat banyak request
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// INI KUNCINYA: Tambahin .promise() supaya bisa pake async/await
const db = pool.promise();

// Cek koneksi (Opsional tapi bagus buat debug)
db.getConnection()
  .then(() => console.log("✅ Connected to MySQL database (Promise Mode)"))
  .catch((err) => console.log("❌ Database connection failed:", err));

module.exports = db;