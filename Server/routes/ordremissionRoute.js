const express = require("express");
const ordremissionController = require("../controllers/ordremissionController");
const router = express.Router();

router
  .route("/")
  .get(ordremissionController.getOrdremission)
  .post(ordremissionController.insertOrdremission);
router
  .route("/distinctEmployees")
  .get(ordremissionController.selectNomfromOrder);
router
  .route("/:id")
  .put(ordremissionController.editOrdremission)
  .delete(ordremissionController.deleteOrdremission);
router.get("/employeeMissions", ordremissionController.getEmployeeMissions);
router.put("/updateNumMandat/:num", ordremissionController.updateNumMandat);
router.put(
  "/updateDeleteNumMandat/:num",
  ordremissionController.updateDeleteNumMandat
);
router.route("/:NumMandat").get(ordremissionController.getMissionAndNumMandat);
router.get("/nomprenom/:num", ordremissionController.getNomPrenomFromOM);

module.exports = router;
