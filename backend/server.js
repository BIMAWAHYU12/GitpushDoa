const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ===== ROUTES =====
const dashboardRoutes = require("./routes/dashboardRoutes");
const barangRoutes = require("./routes/barangRoutes");
const transaksiRoutes = require("./routes/transaksiRoutes");

// gunakan semua route
app.use("/api", dashboardRoutes);
app.use("/api", barangRoutes);
app.use("/api/transaksi", transaksiRoutes);

// ===== PORT =====
const PORT = process.env.PORT || 5000;

// cukup 1 server aja
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});