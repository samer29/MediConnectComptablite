const express = require("express");
const budgetController = require("../controllers/budgetController");
const router = express.Router();

router
  .route("/")
  .get(budgetController.getBudget)
  .post(budgetController.insertBudget);

router
  .route("/:id")
  .patch(budgetController.editBudget)
  .delete(budgetController.deleteBudget);
router.route("/specific").get(budgetController.getSpecificBudget);

module.exports = router;
