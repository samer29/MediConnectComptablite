const express = require("express");
const budgetdetailController = require("../controllers/budgetdetailController");
const router = express.Router();

router
  .route("/")
  .get(budgetdetailController.getBudgetdetail)
  .post(budgetdetailController.insertBudgetdetail);

router
  .route("/:id")
  .patch(budgetdetailController.editBudgetdetail)
  .delete(budgetdetailController.deleteBudgetdetail);

module.exports = router;
