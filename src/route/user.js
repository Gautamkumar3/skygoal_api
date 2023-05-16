const express = require("express");
const {
  registerUser,
  userLogin,
  getAllUser,
} = require("../controller/userControler");
const AuthMiddleware = require("../middleware/AuthMiddleware");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", userLogin);
userRouter.get("/all", AuthMiddleware, getAllUser);

module.exports = userRouter;
