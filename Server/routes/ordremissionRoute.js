const express = require("express");
const ordremissionController = require("../controllers/ordremissionController");
const router = express.Router();

router
  .route("/")
  .get(ordremissionController.getOrdremission)
  .post(ordremissionController.insertOrdremission);

router
  .route("/:id")
  .put(ordremissionController.editOrdremission)
  .delete(ordremissionController.deleteOrdremission);

module.exports = router;
