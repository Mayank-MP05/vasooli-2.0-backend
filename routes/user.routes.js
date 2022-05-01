const express = require("express");
const logger = require("../config/logger");
const userRouter = express.Router();

userRouter.post("/login", (req, res) => {
  const { body } = req;
  logger.debug(body);
  res.send("Login Route for user");
});

userRouter.post("/register", (req, res) => {
  res.send("Register Route for user");
});

userRouter.post("/logout", (req, res) => {
  res.send("Logout Route for user");
});

userRouter.post("/editProfile/:id", (req, res) => {
  res.send("editProfile Route for user");
});

module.exports = userRouter;
