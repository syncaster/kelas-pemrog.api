// function validateMahasiswa(req, res, next) {
//   const { nim, nama, email, jurusan, angkatan } = req.body;
//   const errors = [];

//   if (!nim) errors.push("nim wajib diisi");
//   if (!nama) errors.push("nama wajib diisi");
//   if (!jurusan) errors.push("jurusan wajib diisi");

//   const emailOk = /^\S+@\S+\.\S+$/.test(email);
//   if (!emailOk) {
//     errors.push("format email tidak valid");
//   }

//   if (!Number.isInteger(angkatan) || angkatan < 2000) {
//     errors.push("angkatan harus angka >= 2000");
//   }
//   if (errors.length > 0) {
//     return res.status(400).json({
//       status: "error",
//       message: "Validasi gagal",
//       errors,
//     });
//   }
//   next();
// }
// module.exports = validateMahasiswa;

//refactoring pada part 2
// Aturan per field: true = valid
const aturan = {
  nim: (v) => Boolean(v),
  nama: (v) => Boolean(v),
  email: (v) => /^\S+@\S+\.\S+$/.test(v),
  jurusan: (v) => Boolean(v),
  angkatan: (v) => Number.isInteger(v) && v >= 2000,
};

// Pesan kesalahan per field
const pesan = {
  nim: "nim wajib diisi",
  nama: "nama wajib diisi",
  email: "format email tidak valid",
  jurusan: "jurusan wajib diisi",
  angkatan: "angkatan harus angka >= 2000",
};

// parsial = false: semua field wajib (POST, PUT)
// parsial = true : hanya field yang dikirim diperiksa (PATCH)
function validasi(body, parsial) {
  const errors = [];

  for (const f of Object.keys(aturan)) {
    if (parsial && body[f] === undefined) continue; // PATCH: lewati
    if (!aturan[f](body[f])) errors.push(pesan[f]);
  }

  if (parsial && Object.keys(aturan).every((f) => body[f] === undefined)) {
    errors.push("minimal satu field harus dikirim");
  }
  return errors;
}

const cek = (parsial) => (req, res, next) => {
  const errors = validasi(req.body || {}, parsial);
  if (errors.length > 0) {
    return res.status(400).json({
      status: "error",
      message: "Validasi gagal",
      errors,
    });
  }
  next();
};

module.exports = {
  validateMahasiswa: cek(false), // POST dan PUT: semua wajib
  validatePatch: cek(true), // PATCH: hanya yang dikirim
};
