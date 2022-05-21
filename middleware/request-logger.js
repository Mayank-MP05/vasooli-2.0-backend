const logger = require("../config/logger");

const requestLogger = (req, res, next) => {
  logger.debug(`${req.method}: ${req.path}`);
  logger.info(`PAYLOAD: %o`, req.body);
  next();
};

module.exports = requestLogger;
