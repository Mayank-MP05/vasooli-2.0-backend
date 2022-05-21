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

/**
 * @swagger
 * /transactions/read/{userId}:
 *  get:
 *    tags:
 *    - "Transactions"
 *    summary: "Get all transactions for a user"
 *    description: "Returns array of transactions along with success and error flags"
 *    operationId: "/transactions/read/{userId}"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "path"
 *      name: "userId"
 *      example: 4
 *      description: "Txn Read Payload"
 *      required: true
 *    responses:
 *      "200":
 *        description: "Read all txn by userId success!!"
 */
txnRouter.get("/read/:userId", (req, res) => {
  const { userId: userIdX } = req.params;
  const userId = parseInt(userIdX);

  vasooliDB.query(
    "SELECT * FROM transactions WHERE userId = ?",
    [userId],
    (err, results) => {
      logger.info("%o %o", err, results);
      if (err) {
        res.status(500).send({
          message: "Error in reading transactions",
          success: false,
          error: true,
          ...err,
        });
      } else {
        res.status(200).send({
          message: "fetch transactions success!!",
          success: true,
          error: false,
          txnArr: results,
        });
      }
    }
  );
});

/**
 * @swagger
 * /transactions/update/{txnId}:
 *  put:
 *    tags:
 *    - "Transactions"
 *    summary: "Update the particular transaction record"
 *    description: "Returns array of updated transaction along with success and error flags"
 *    operationId: "/transactions/update/{txnId}"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "path"
 *      name: "txnId"
 *      example: 2
 *      description: "Txn Id to Update"
 *      required: true
 *    - in: "body"
 *      name: "body"
 *      description: "Txn Update Payload"
 *      required: true
 *      schema:
 *        type: "object"
 *        properties:
 *          userId:
 *            type: "string"
 *            example: 4
 *          type:
 *            type: "string"
 *            example: "EXP"
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
 *            example: "Updated Sample Txn Description"
 *    responses:
 *      "200":
 *        description: "update txn by txnId success!!"
 */
txnRouter.put("/update/:txnId", (req, res) => {
  const { txnId: txnIdX } = req.params;
  const txnId = parseInt(txnIdX);
  const { body } = req;
  const { userId, type, amount, category, date, description } = body;

  vasooliDB.query(
    "UPDATE transactions SET  type = ?, amount = ?, category = ?, date = ?, description = ? WHERE txnId = ?",
    [type, amount, category, date, description, txnId],
    (err, results) => {
      logger.info("%o %o", err, results);
      if (err) {
        res.status(500).send({
          message: "Error in updating transaction",
          success: false,
          error: true,
          ...err,
        });
      } else {
        res.status(200).send({
          message: "Transaction updated successfully",
          success: true,
          error: false,
          ...results,
        });
      }
    }
  );
});

/**
 * @swagger
 * /transactions/delete/{txnId}:
 *  delete:
 *    tags:
 *    - "Transactions"
 *    summary: "Delete a specific transaction from db"
 *    description: "Returns deleted txnId along with success and error flags"
 *    operationId: "/transactions/delete/{txnId}"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "path"
 *      name: "txnId"
 *      example: 2
 *      description: "Txn Delete Payload"
 *      required: true
 *    responses:
 *      "200":
 *        description: "Delete Single Txn success!!"
 */
txnRouter.delete("/delete/:txnId", (req, res) => {
  const { txnId: txnIdX } = req.params;
  const txnId = parseInt(txnIdX);

  vasooliDB.query(
    "DELETE FROM transactions WHERE txnId = ?",
    [txnId],
    (err, results) => {
      logger.info("%o %o", err, results);
      if (err) {
        res.status(500).send({
          message: "Error in deleting transaction",
          success: false,
          error: true,
          ...err,
        });
      } else {
        res.status(200).send({
          message: "Transaction deleted successfully",
          success: true,
          error: false,
          ...results,
        });
      }
    }
  );
});

module.exports = txnRouter;
