const express = require("express");
const logger = require("../config/logger");
const vasooliRouter = express.Router();
const vasooliDB = require("../config/mysql-connect");

// Services Imports
const createNotification = require("../services/notification.service");

// Middlewares Imports
const requestLogger = require("../middleware/request-logger");
const authenticate = require("../middleware/authenticate");

/**
 * @swagger
 * /vasooli/create:
 *  post:
 *    tags:
 *    - "Vasooli"
 *    summary: "Add a new vasooli record to the database"
 *    description: "Returns newly added vasooli along with success and error flags"
 *    operationId: "/vasooli/create"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "header"
 *      name: "authorization"
 *      example: "bearar xyz"
 *    - in: "body"
 *      name: "body"
 *      description: "Vasooli Create Payload"
 *      required: true
 *      schema:
 *        type: "object"
 *        properties:
 *          userId:
 *            type: "int64"
 *            example: 4
 *          requestedTo:
 *            type: "string"
 *            example: "one@mail.com"
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
 *            example: "Sample vasooli Description"
 *    responses:
 *      "200":
 *        description: "Vasooli record added successfully"
 */
vasooliRouter.post("/create", requestLogger, authenticate, (req, res) => {
  const { body } = req;
  const { userId, requestedTo, amount, category, date, description } = body;
  vasooliDB.query(
    "SELECT * from users where email = ?",
    [requestedTo],
    (errUser, resultUser) => {
      if (errUser || resultUser.length === 0) {
        res.status(400).json({
          error: true,
          success: false,
          error: "Requested user not found",
        });
        return;
      }
      const requestedFromUserId = resultUser[0].userId;
      //TODO: Push the new vasooli record to DB
      vasooliDB.query(
        "INSERT INTO vasoolis (userId,  amount, category, date, description,requestedTo, status) VALUES (?,  ?, ?, ?, ?, ?, 'PENDING')",
        [userId, amount, category, date, description, requestedFromUserId],
        (err, results) => {
          logger.info("%o %o", err, results);
          if (err) {
            res.status(500).send({
              message: "Error in creating vasooli",
              success: false,
              error: true,
              ...err,
            });
          } else {
            res.status(200).send({
              message: "vasooli created successfully",
              success: true,
              error: false,
              ...results,
            });
            //TODO: Send notification to requestedFromUser
            createNotification({
              priority: 1,
              content: `${resultUser[0].email} has requested you to pay ₹${amount}`,
              userId: requestedFromUserId,
              readStatus: false,
              timestamp: new Date(),
            });
          }
        }
      );
    }
  );
});

/**
 * @swagger
 * /vasooli/read/{userId}:
 *  get:
 *    tags:
 *    - "Vasooli"
 *    summary: "Get all vasooli for a user"
 *    description: "Returns array of vasoolis along with success and error flags"
 *    operationId: "/vasooli/read/{userId}"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "header"
 *      name: "authorization"
 *      example: "bearar xyz"
 *    - in: "path"
 *      name: "userId"
 *      example: 4
 *      description: "Vasooli Read Payload"
 *      required: true
 *    responses:
 *      "200":
 *        description: "Read all Vasooli by userId success!!"
 */
vasooliRouter.get("/read/:userId", requestLogger, authenticate, (req, res) => {
  const { userId: userIdX } = req.params;
  const userId = parseInt(userIdX);

  vasooliDB.query(
    "SELECT * FROM vasoolis WHERE userId = ? OR requestedTo = ?",
    [userId, userId],
    (err, results) => {
      if (err) {
        res.status(500).send({
          message: "Error in reading vasooli records",
          success: false,
          error: true,
          ...err,
        });
      } else {
        res.status(200).send({
          message: "All vasooli record fetch successful!!",
          success: true,
          error: false,
          vasooliArr: results,
        });
      }
    }
  );
});

/**
 * @swagger
 * /vasooli/update/{vasooliId}:
 *  put:
 *    tags:
 *    - "Vasooli"
 *    summary: "Update the particular vasooli record"
 *    description: "Returns array of updated vasooli along with success and error flags"
 *    operationId: "/vasooli/update/{vasooliId}"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "header"
 *      name: "authorization"
 *      example: "bearar xyz"
 *    - in: "path"
 *      name: "vasooliId"
 *      example: 2
 *      description: "vasooli Id to Update"
 *      required: true
 *    - in: "body"
 *      name: "body"
 *      description: "vasooli Update Payload"
 *      required: true
 *      schema:
 *        type: "object"
 *        properties:
 *          userId:
 *            type: "int64"
 *            example: 4
 *          requestedTo:
 *            type: "string"
 *            example: "one@mail.com"
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
 *            example: "Updated Sample vasooli Description"
 *          status:
 *            type: "string"
 *            example: "APPROVED"
 *          statusUpdated:
 *            type: "bool"
 *            example: false
 *    responses:
 *      "200":
 *        description: "update vasooli by vasooliId success!!"
 */
vasooliRouter.put(
  "/update/:vasooliId",
  requestLogger,
  authenticate,
  (req, res) => {
    const { body } = req;
    const { vasooliId: vasooliIdX } = req.params;
    const vasooliId = parseInt(vasooliIdX);

    const {
      userId,
      requestedTo,
      amount,
      category,
      date,
      description,
      status,
      statusUpdated,
    } = body;
    vasooliDB.query(
      "SELECT * from users where email = ?",
      [requestedTo],
      (errUser, resultUser) => {
        if (errUser || resultUser.length === 0) {
          res.status(400).json({
            error: true,
            success: false,
            error: "Requested user not found",
          });
          return;
        }
        const requestedFromUserId = resultUser[0].userId;
        //TODO: Update the vasooli record to DB
        vasooliDB.query(
          `UPDATE vasoolis
        SET amount = ?, category = ?, date = ?, description = ?, requestedTo = ?, status = ? WHERE vasooliId = ?`,
          [
            amount,
            category,
            date,
            description,
            requestedFromUserId,
            status,
            vasooliId,
          ],
          (err, results) => {
            logger.info("%o %o", err, results);
            if (err) {
              res.status(500).send({
                message: "Error in updating vasooli record",
                success: false,
                error: true,
                ...err,
              });
            } else {
              res.status(200).send({
                message: "Vasooli record updated successfully",
                success: true,
                error: false,
                ...results,
              });
              //TODO: Send notification to requestedFromUser on Status update
              if (statusUpdated) {
                let content = ``;
                const payee = resultUser[0].email;
                if (status === "APPROVED") {
                  content = `${payee} has approved your payment of ₹${amount}`;
                } else if (status === "REJECTED") {
                  content = `${payee} has rejected your payment of ₹${amount}`;
                } else if (status === "PAID") {
                  content = `${payee} has paid you ₹${amount}`;
                }
                createNotification({
                  priority: 1,
                  content,
                  userId: requestedFromUserId,
                  readStatus: false,
                  timestamp: new Date(),
                });
              }
            }
          }
        );
      }
    );
  }
);

/**
 * @swagger
 * /vasooli/delete/{vasooliId}:
 *  delete:
 *    tags:
 *    - "Vasooli"
 *    summary: "Delete a specific vasooli from db"
 *    description: "Returns deleted vasooliId along with success and error flags"
 *    operationId: "/vasooli/delete/{vasooliId}"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "header"
 *      name: "authorization"
 *      example: "bearar xyz"
 *    - in: "path"
 *      name: "vasooliId"
 *      example: 2
 *      description: "Vasooli Delete Payload"
 *      required: true
 *    responses:
 *      "200":
 *        description: "Delete Single Vasooli Done!!"
 */
vasooliRouter.delete(
  "/delete/:vasooliId",
  requestLogger,
  authenticate,
  (req, res) => {
    const { vasooliId: vasooliIdX } = req.params;
    const vasooliId = parseInt(vasooliIdX);

    vasooliDB.query(
      "DELETE FROM vasoolis WHERE vasooliId = ?",
      [vasooliId],
      (err, results) => {
        logger.info("%o %o", err, results);
        if (err) {
          res.status(500).send({
            message: "Error in deleting vasooli record",
            success: false,
            error: true,
            ...err,
          });
        } else {
          res.status(200).send({
            message: "Vasooli record deleted successfully",
            success: true,
            error: false,
            ...results,
          });
        }
      }
    );
  }
);

module.exports = vasooliRouter;
