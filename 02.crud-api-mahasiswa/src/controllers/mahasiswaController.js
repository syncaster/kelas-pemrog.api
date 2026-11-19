const repo = require("../repositories/mahasiswaRepository");

exports.create = async (req, res, next) => {
  try {
    const data = await repo.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Mahasiswa berhasil ditambahkan",
      data,
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({
        status: "error",
        message: "NIM atau email sudah terdaftar",
      });
    }
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const data = await repo.findAll();

    res.status(200).json({
      status: "success",
      count: data.length,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        status: "error",
        message: "ID harus angka positif",
      });
    }

    const data = await repo.findById(id);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: `Mahasiswa id ${id} tidak ditemukan`,
      });
    }

    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

//endpoint put
exports.replace = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = await repo.replace(id, req.body);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: `Mahasiswa id ${id} tidak ditemukan`,
      });
    }
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

//endpoint patch
exports.update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = await repo.update(id, req.body);

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: `Mahasiswa id ${id} tidak ditemukan`,
      });
    }
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!(await repo.remove(id)))
      return res
        .status(404)
        .json({ status: "error", message: "Tidak ditemukan" });
    res.status(204).send();
  } catch (err) {
    // 23503 = foreign_key_violation (masih dirujuk tabel lain)
    if (err.code === "23503") {
      return res.status(409).json({
        status: "error",
        message: "Mahasiswa masih dipakai data lain",
      });
    }
    next(err);
  }
};
