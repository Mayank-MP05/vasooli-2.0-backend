const express = require("express");
const logger = require("../config/logger");
const requestLogger = require("../middleware/request-logger");
const vasooliRouter = express.Router();
const vasooliDB = require("../config/mysql-connect");

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
vasooliRouter.post("/create", (req, res) => {
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
      const requestedToUser = resultUser[0].userId;
      //TODO: Push the new vasooli record to DB
      vasooliDB.query(
        "INSERT INTO vasoolis (userId,  amount, category, date, description,requestedTo, status) VALUES (?,  ?, ?, ?, ?, ?, 'PENDING')",
        [userId, amount, category, date, description, requestedToUser],
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
          }
        }
      );
    }
  );
});

vasooliRouter.get("/read", (req, res) => {
  res.send("vasooli Route for Read");
});

vasooliRouter.put("/update/:id", (req, res) => {
  res.send("vasooli Route for Update by id");
});

vasooliRouter.delete("/delete/:id", (req, res) => {
  res.send("vasooli Route for Delete by id");
});

module.exports = vasooliRouter;
