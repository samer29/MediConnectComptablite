const express = require("express");
const employeeController = require("../controllers/employeeController");
const router = express.Router();

router
  .route("/")
  .get(employeeController.getEmployee)
  .post(employeeController.insertEmployee);

router
  .route("/:id")
  .get(employeeController.getEmployeeById) // Add this line
  .put(employeeController.editEmployee)
  .delete(employeeController.deleteEmployee);
router
  .route("/nomprenom/:nomPrenom")
  .get(employeeController.getEmployeeByNomPrenom);

module.exports = router;
