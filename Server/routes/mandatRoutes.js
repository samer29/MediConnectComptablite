const express = require("express");
const mandatController = require("../controllers/mandatController");
const router = express.Router();

router
  .route("/")
  .get(mandatController.getMandat)
  .post(mandatController.insertMandat);

router
  .route("/:id")
  .patch(mandatController.editMandat)
  .delete(mandatController.deleteMandat);

module.exports = router;
