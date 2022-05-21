const express = require("express");
const logger = require("../config/logger");
const requestLogger = require("../middleware/request-logger");
const txnRouter = express.Router();

/**
 * @swagger
 * /transactions/create:
 *  post:
 *    tags:
 *    - "Transactions"
 *    summary: "Add a new transaction to the database"
 *    description: "Returns newly added transaction along with success and error flags"
 *    operationId: "/transactions/create"
 *    produces:
 *    - "application/json"
 *    parameters: []
 *    responses:
 *      "200":
 *        description: "Transaction added successfully"
 *        schema:
 *          type: "object"
 *          additionalProperties:
 *            type: "integer"
 *            format: "int32"
 *    security:
 *    - JWT: []
 *    securityDefinitions:
 *      JWT:
 *        type: apiKey
 *        in: header
 *        name: access_token
 */
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
