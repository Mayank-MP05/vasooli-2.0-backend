const { MongoClient } = require("mongodb");
const logger = require("./logger");

const uri =
  "mongodb://localhost:27017/vasooliNotif?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
const client = new MongoClient(uri);
async function run() {
  try {
    logger.info("Connecting to MongoDB instance on localhost:27017");
    await client.connect();
    const database = client.db("vasooliNotif");
    const notifications = database.collection("notifications");
    logger.info("Connection to MongoDB instance was successful!");
    logger.debug(notifications);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
