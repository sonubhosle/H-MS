const express = require("express");
const router = express.Router();

const UserController = require("../Controllers/UserControllers");
const Authenticate = require("../Middleware/Authenticate");
const { upload } = require("../Config/cloudinary");


router.post("/auth/signup", upload.single("photo"), UserController.register);
router.post("/auth/login", UserController.login);
router.post("/auth/forgot-password", UserController.forgotPassword);
router.post("/auth/reset-password", UserController.resetPassword);





router.get("/users", Authenticate, UserController.getAllUsers);
router.get("/users/profile", Authenticate, UserController.getUserProfile);

router.put(
  "/users/update",
  Authenticate,
  UserController.updateProfile
);



module.exports = router;
