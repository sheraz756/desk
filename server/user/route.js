const express = require("express");
const router = express.Router();

//multer
const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({
  storage,
});

const checkAccessWithSecretKey = require("../../checkAccess");

const userController = require("./controller");

router.get("/userGet", checkAccessWithSecretKey(), userController.userGet);

router.get(
  "/userProfile",
  checkAccessWithSecretKey(),
  userController.userProfile
);

router.post(
  "/userProfile",
  checkAccessWithSecretKey(),
  upload.single("image"),
  userController.loginUser
);

router.patch(
  "/userProfile",
  checkAccessWithSecretKey(),
  upload.single("image"),
  userController.updateUser
);

router.patch("/isBlock", checkAccessWithSecretKey(), userController.isBlock);

//admin can add or less the Coin or diamond of user through admin panel
router.post(
  "/addLessCoin",
  checkAccessWithSecretKey(),
  userController.addOrLessCoin
);

module.exports = router;
