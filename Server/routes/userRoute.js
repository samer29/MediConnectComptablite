const express = require("express");
const userController = require("../controllers/userController");
const autorization = require("../middlewares/authorization");
const router = express.Router();
router.route("/").get(userController.getUsers).post(userController.insertUser);
router
  .route("/:id")
  .patch(userController.editUser)
  .delete(userController.deleteUser);
// Login route
router.post("/login", userController.loginUser);
router.get("/getuser", userController.getUserById);
router.get("/isverify", autorization, userController.authorizationfunc);
module.exports = router;
