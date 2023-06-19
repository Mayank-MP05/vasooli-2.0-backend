const mysql = require("mysql2");
const logger = require("./logger");

/**
 * Creates a MySQL connection pool and returns a singleton instance of it.
 * @function
 * @returns {Object} The singleton instance of the MySQL connection pool.
 */
const createDatabase = (() => {
  let singletonSqlInstance;

  return () => {
    if (!singletonSqlInstance) {
      singletonSqlInstance = mysql.createPool({
        connectionLimit: 10,
        host: "localhost", // host for connection
        port: 3306, // default port for mysql is 3306
        database: "vasooli_db", // database from which we want to connect out node application
        user: "root", // username of the mysql connection
        password: "root", // password of the mysql connection
      });
      logger.info("Connection to MySQL DB - SUCCESSFUL!");
    }
    return singletonSqlInstance;
  };
})();

Object.freeze(createDatabase);

module.exports = createDatabase();
