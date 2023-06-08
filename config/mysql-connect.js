const mysql = require("mysql2");
const logger = require("./logger");

logger.info("Connecting to MySQL instance ...");
const connection = mysql.createPool({
  connectionLimit: 10,
  host: "localhost", // host for connection
  port: 3306, // default port for mysql is 3306
  database: "vasooli_db", // database from which we want to connect out node application
  user: "root", // username of the mysql connection
  password: "root", // password of the mysql connection
});

if (connection) {
  // mysql is started && connected successfully.
  logger.info("Connection to MySQL DB - SUCCESSFUL!");
} else {
  logger.info("[MySQL]: Error occured while connecting");
}

module.exports = connection;
