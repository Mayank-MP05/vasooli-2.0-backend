const { MongoClient } = require("mongodb");
const logger = require("./logger");

const uri =
  "mongodb://localhost:27017/vasooliNotif?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
const client = new MongoClient(uri);
async function mongoDBConnector() {
  try {
    logger.info("Connecting to MongoDB instance ...");
    await client.connect();
    const database = client.db("vasooliNotif");
    const notifications = database.collection("notifications");
    logger.info("Connection to MongoDB - SUCCESSFUL!");
    return notifications;
  } finally {
    await client.close();
  }
  return null;
}

const notifDB = mongoDBConnector();
module.exports = notifDB;
