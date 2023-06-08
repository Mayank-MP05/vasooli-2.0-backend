const { MongoClient } = require("mongodb");
const logger = require("./logger");

const uri = process.env.MONGO_DB_URI;

const client = new MongoClient(uri);
async function mongoDBConnector(cb) {
  try {
    logger.info("Connecting to MongoDB instance ...");
    await client.connect();
    const database = client.db("vasooliNotif");
    const notifications = database.collection("notifications");
    logger.info("Connection to MongoDB - SUCCESSFUL!");
    cb(client, notifications);
  } finally {
    // await client.close();
  }
  return null;
}

module.exports = mongoDBConnector;
