const express = require("express");
const gradesController = require("../controllers/gradesController");
const router = express.Router();

router
  .route("/")
  .get(gradesController.getGrades)
  .post(gradesController.insertGrades);

router
  .route("/:id")
  .patch(gradesController.editGrades)
  .delete(gradesController.deleteGrades);

module.exports = router;
