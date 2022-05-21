const logger = require("../config/logger");
const mongoDBConnector = require("../config/mongo-db-connect");
const DELAY_FOR_NON_PRIORITY_TASK = 500;

const createNotification = ({ priority, content, userId, timestamp }) => {
  if (priority === 1) {
    mongoDBConnector(async (client, notifications) => {
      await notifications.insertOne({
        userId,
        readStatus: false,
        priority: 1,
        content,
        timestamp,
      });
      await client.close();
    });
  } else {
    // Non Priority Task
    logger.info("Non Priority Task: Enqueuing in Queue");
    setTimeout(() => {
      mongoDBConnector(async (client, notifications) => {
        logger.info("Non Priority Task: Execution Started ...");
        await notifications.insertOne({
          priority: 2,
          content,
          timestamp,
        });
        await client.close();
      });
    }, DELAY_FOR_NON_PRIORITY_TASK);
  }
};

module.exports = createNotification;
