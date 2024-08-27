const express = require("express");
const etatController = require("../controllers/etatController");
const router = express.Router();

router.route("/").get(etatController.getEtat).post(etatController.insertEtat);

router
  .route("/:id")
  .patch(etatController.editEtat)
  .delete(etatController.deleteEtat);

router.route("/ordremissions/:id").get(etatController.getEmployeeEtats);

module.exports = router;
