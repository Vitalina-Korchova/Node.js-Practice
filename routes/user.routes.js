const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middlewares/auth");
const roleMiddleware = require("../middlewares/roleMiddleware");

//закриті
router.get("/", authMiddleware, userController.getAllUsers);
router.get("/admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.send("<h1>Тут адмін</h1>");
});
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/search", authMiddleware, userController.getFilteredUsers);
router.get("/:id", authMiddleware, userController.getUserById);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);

//відкриті реєстрація та вхід
router.post("/", userController.createUser);
router.post("/login", authController.login);

module.exports = router;
