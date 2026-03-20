const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
const dashboardRoutes = require("./routes/dashboardRoutes");
const barangRoutes = require("./routes/barangRoutes");
const transaksiRoutes = require("./routes/transaksiRoutes");

// GUNAKAN PREFIX /api
app.use("/api", dashboardRoutes);
app.use("/api", barangRoutes);
app.use("/api", transaksiRoutes);

// PORT (cukup satu aja)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});