const router = require("express").Router();
const ctrl = require("../controllers/mahasiswaController");
const parseId = require("../middlewares/parseId");
const {
  validateMahasiswa,
  validatePatch,
} = require("../middlewares/validateMahasiswa");

router.get("/", ctrl.getAll);
router.get("/:id", parseId, ctrl.getById);
router.post("/", validateMahasiswa, ctrl.create);
router.put("/:id", parseId, validateMahasiswa, ctrl.replace);
router.patch("/:id", parseId, validatePatch, ctrl.update);
router.delete("/:id", parseId, ctrl.remove);

module.exports = router;
