const { MongoClient } = require("mongodb");
const logger = require("./logger");

const MONGO_DB_URI = process.env.MONGO_DB_URI;

/**
 * MongoDBConnector class is a singleton class that connects to MongoDB instance
 * and provides a client object to perform database operations.
 */
class MongoDBConnector {
  /**
   * Creates an instance of MongoDBConnector.
   * @memberof MongoDBConnector
   */
  constructor() {
    if (!MongoDBConnector.instance) {
      logger.info("[SINGLETON] Connecting to MongoDB instance ...");
      this.client = new MongoClient(MONGO_DB_URI);
      MongoDBConnector.instance = this;
    }

    logger.info("[SINGLETON] existing mongo db instance returned ...");
    return MongoDBConnector.instance;
  }

  /**
   * Connects to MongoDB instance and returns a client object and notifications collection.
   * @param {function} callbackFn - Callback function that takes client object and notifications collection as arguments.
   * @memberof MongoDBConnector
   */
  async connect(callbackFn) {
    try {
      await this.client.connect();
      const database = this.client.db("vasooliNotif");
      const notifications = database.collection("notifications");
      callbackFn(this.client, notifications);
    } catch (error) {
      logger.error(`Error connecting to MongoDB: ${error}`);
    }
  }

  /**
   * Closes the connection to MongoDB instance.
   * @memberof MongoDBConnector
   */
  async close() {
    try {
      await this.client.close();
      logger.info("Connection to MongoDB - CLOSED!");
    } catch (error) {
      logger.error(`Error closing MongoDB connection: ${error}`);
    }
  }
}

module.exports = mongoDBConnector = new MongoDBConnector();