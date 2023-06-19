const express = require("express");
const logger = require("../config/logger");
const notifRouter = express.Router();

// Database Connection Handlers
const mongoDBConnector = require("../config/mongo-db-connect");

/**
 * @swagger
 * /notif/read/{userId}:
 *  get:
 *    tags:
 *    - "Notifications"
 *    summary: "Get all notifications for a user"
 *    description: "Returns array of notifications along with success and error flags"
 *    operationId: "/notifications/read/{userId}"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "path"
 *      name: "userId"
 *      example: 4
 *      description: "Notif Read Payload"
 *      required: true
 *    responses:
 *      "200":
 *        description: "Read all Notif by userId success!!"
 */
notifRouter.get("/read/:userId", (req, res) => {
  const { body } = req;
  const { userId: userIdX } = req.params;
  const userId = parseInt(userIdX);
  mongoDBConnector.connect((client, notifications) => {
    notifications
      .find({
        $or: [{ priority: 2 }, { $and: [{ priority: 1 }, { userId: userId }] }],
      })
      .sort({ timestamp: -1 })
      .toArray(async (err, results) => {
        if (err) {
          res.status(500).json({
            success: false,
            error: true,
            message: "Error fetching notifications",
          });
        }
        res.status(200).json({
          success: true,
          error: false,
          notifArr: results,
        });
        await client.close();
      });
  });
});

notifRouter.post("/markAllRead", (req, res) => {
  const { body } = req;
  logger.debug(body);
  res.send("Notification Route for markAllRead");
});

module.exports = notifRouter;
