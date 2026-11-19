const pool = require("./config/db");

pool
  .query("SELECT NOW() as waktu")
  .then((res) => {
    console.log("Terhubung:", res.rows[0].waktu);
  })
  .catch((err) => {
    console.error("Gagal:", err.message);
  });
