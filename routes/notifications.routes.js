const express = require("express");
const logger = require("../config/logger");
const notifRouter = express.Router();

notifRouter.post("/read", (req, res) => {
  const { body } = req;
  logger.debug(body);
  res.send("Notification Route for read");
});

notifRouter.post("/markAllRead", (req, res) => {
    const { body } = req;
    logger.debug(body);
  res.send("Notification Route for markAllRead");
});

module.exports = notifRouter;