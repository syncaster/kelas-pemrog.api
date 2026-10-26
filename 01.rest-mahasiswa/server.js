//Saiful NB - Kelas Pemrog.API
// Contoh implementasi REST di Express (Node.js) - API Mahasiswa
// Jalankan: npm install && npm start   (server di http://localhost:3000)
const express = require("express");
const app = express();
app.use(express.json()); // parsing body JSON (representation)

// Data sementara di memori (nanti diganti PostgreSQL pada minggu 5)
let mahasiswa = [
  { id: 1, nama: "Budi", nim: "23104414" },
  { id: 2, nama: "Siti", nim: "23104415" },
];
let nextId = 3;

const router = express.Router();

// GET /mahasiswa -> 200 OK (lihat semua)
router.get("/", (req, res) => {
  res.status(200).json({ success: true, data: mahasiswa });
});

// GET /mahasiswa/:id -> 200 OK | 404 Not Found (lihat satu)
router.get("/:id", (req, res) => {
  const m = mahasiswa.find((x) => x.id === Number(req.params.id));
  if (!m)
    return res
      .status(404)
      .json({ success: false, message: "Mahasiswa tidak ditemukan" });
  res.status(200).json({ success: true, data: m });
});

// POST /mahasiswa -> 201 Created + header Location | 422 data tidak valid (buat baru)
router.post("/", (req, res) => {
  const { nama, nim } = req.body;
  if (!nama || !nim) {
    return res
      .status(422)
      .json({ success: false, message: "nama dan nim wajib diisi" });
  }
  const baru = { id: nextId++, nama, nim };
  mahasiswa.push(baru);
  res
    .status(201)
    .location(`/mahasiswa/${baru.id}`)
    .json({ success: true, data: baru });
});

// PUT /mahasiswa/:id -> mengganti SELURUH data | 200 OK | 404 | 422
router.put("/:id", (req, res) => {
  const idx = mahasiswa.findIndex((x) => x.id === Number(req.params.id));
  if (idx === -1)
    return res
      .status(404)
      .json({ success: false, message: "Mahasiswa tidak ditemukan" });
  const { nama, nim } = req.body;
  if (!nama || !nim) {
    return res.status(422).json({
      success: false,
      message: "PUT membutuhkan nama dan nim lengkap",
    });
  }
  mahasiswa[idx] = { id: mahasiswa[idx].id, nama, nim };
  res.status(200).json({ success: true, data: mahasiswa[idx] });
});

// PATCH /mahasiswa/:id -> mengubah SEBAGIAN data | 200 OK | 404
router.patch("/:id", (req, res) => {
  const m = mahasiswa.find((x) => x.id === Number(req.params.id));
  if (!m)
    return res
      .status(404)
      .json({ success: false, message: "Mahasiswa tidak ditemukan" });
  if (req.body.nama) m.nama = req.body.nama;
  if (req.body.nim) m.nim = req.body.nim;
  res.status(200).json({ success: true, data: m });
});

// DELETE /mahasiswa/:id -> 204 No Content | 404 (hapus)
router.delete("/:id", (req, res) => {
  const idx = mahasiswa.findIndex((x) => x.id === Number(req.params.id));
  if (idx === -1)
    return res
      .status(404)
      .json({ success: false, message: "Mahasiswa tidak ditemukan" });
  mahasiswa.splice(idx, 1);
  res.status(204).send();
});

app.use("/mahasiswa", router); // satu resource, satu router: URI sama, method berbeda

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`REST API berjalan di http://localhost:${PORT}`),
);
