const express = require("express");
const routes = require("./routes/mahasiswaRoutes");

const app = express();
app.use(express.json());
app.use("/api/mahasiswa", routes);

// Endpoint tidak dikenal
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route tidak ditemukan",
  });
});

// Error handler terpusat (harus punya 4 parameter)
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      status: "error",
      message: "JSON tidak valid",
    });
  }
  if (err.code === "23505") {
    return res.status(409).json({
      status: "error",
      message: "NIM atau email sudah terdaftar",
    });
  }
  console.error(err); // detail hanya di log server
  res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan pada server",
  });
});

module.exports = app;
