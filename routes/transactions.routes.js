const express = require("express");
const logger = require("../config/logger");
const txnRouter = express.Router();

txnRouter.post("/create", (req, res) => {
  const { body } = req;
  logger.debug(body);
  res.send("Transaction Route for create");
});

txnRouter.get("/read", (req, res) => {
  res.send("Transaction Route for read");
});

txnRouter.get("/read/:id", (req, res) => {
  res.send("Transaction Route for read by id");
});

txnRouter.put("/update/:id", (req, res) => {
  res.send("transaction Route for update by id");
});

txnRouter.delete("/delete/:id", (req, res) => {
  res.send("transaction Route for delete by id");
});

module.exports = txnRouter;
