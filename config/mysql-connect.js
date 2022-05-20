const mysql = require("mysql2");
const logger = require("./logger");

const connection = mysql.createPool({
  connectionLimit: 10,
  host: "localhost", // host for connection
  port: 3306, // default port for mysql is 3306
  database: "vasooli", // database from which we want to connect out node application
  user: "root", // username of the mysql connection
  password: "password", // password of the mysql connection
});

if (connection) {
  // mysql is started && connected successfully.
  logger.info("MySQL Connection successful!");
} else {
  logger.info("error occured while connecting");
}

connection.query("SELECT * from users", function (err, result) {
  if (err) throw err;
  logger.debug("Result: " + result);
  logger.info("%O", result);
});
