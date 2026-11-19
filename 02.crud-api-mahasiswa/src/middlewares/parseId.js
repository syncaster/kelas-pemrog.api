function parseId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      status: "error",
      message: "ID harus bilangan bulat positif",
    });
  }
  req.id = id;
  next();
}

module.exports = parseId;
