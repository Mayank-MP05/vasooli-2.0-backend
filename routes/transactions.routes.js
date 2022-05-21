const express = require("express");
const logger = require("../config/logger");
const requestLogger = require("../middleware/request-logger");
const txnRouter = express.Router();

// Database Connection Handlers
const notifDB = require("../config/mongo-db-connect");
const vasooliDB = require("../config/mysql-connect");

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
 *    parameters:
 *    - in: "body"
 *      name: "body"
 *      description: "Txn Create Payload"
 *      required: true
 *      schema:
 *        type: "object"
 *        properties:
 *          userId:
 *            type: "string"
 *            example: 4
 *          type:
 *            type: "string"
 *            example: "INC"
 *          amount:
 *            type: "int64"
 *            example: 100
 *          category:
 *            type: "int64"
 *            example: 0
 *          date:
 *            type: "date"
 *            example: 	"2022-5-21 10:50:19"
 *          description:
 *            type: "string"
 *            example: "Sample Txn Description"
 *    responses:
 *      "200":
 *        description: "Transaction added successfully"
 *    components:
 *      securitySchemes:
 *        bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *    security:
 *      - bearerAuth: []
 *    securityDefinitions:
 *      JWT:
 *        type: apiKey
 *        in: header
 *        name: access_token
 */
txnRouter.post("/create", requestLogger, (req, res) => {
  const { body } = req;
  const { userId, type, amount, category, date, description } = body;
  //TODO: Push the new record txn data to DB
  vasooliDB.query(
    "INSERT INTO transactions (userId, type, amount, category, date, description) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, type, amount, category, date, description],
    (err, results) => {
      logger.info("%o %o", err, results);
      if (err) {
        res.status(500).send({
          message: "Error in creating transaction",
          success: false,
          error: true,
          ...err,
        });
      } else {
        res.status(200).send({
          message: "Transaction created successfully",
          success: true,
          error: false,
          ...results,
        });
      }
    }
  );
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
