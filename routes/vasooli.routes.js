const express = require("express");
const logger = require("../config/logger");
const vasooliRouter = express.Router();

vasooliRouter.post("/create", (req, res) => {
  const { body } = req;
  logger.debug(body);
  res.send("vasooli Route for Create");
});

vasooliRouter.get("/read", (req, res) => {
  res.send("vasooli Route for Read");
});

vasooliRouter.get("/read/:id", (req, res) => {
  res.send("vasooli Route for Read by id");
});

vasooliRouter.put("/update/:id", (req, res) => {
  res.send("vasooli Route for Update by id");
});

vasooliRouter.delete("/delete/:id", (req, res) => {
  res.send("vasooli Route for Delete by id");
});

module.exports = vasooliRouter;