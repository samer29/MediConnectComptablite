const express = require("express");
const employeeController = require("../controllers/employeeController");
const router = express.Router();

router
  .route("/")
  .get(employeeController.getEmployee)
  .post(employeeController.insertEmployee);

router
  .route("/:id")
  .put(employeeController.editEmployee)
  .delete(employeeController.deleteEmployee);

module.exports = router;
