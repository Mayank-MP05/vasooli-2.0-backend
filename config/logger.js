const winston = require("winston");
const { format } = require("winston");
const { combine, timestamp, label, printf, prettyPrint, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});
const logger = winston.createLogger({
  level: "silly",
  format: combine(
    colorize(),
    timestamp(),
    winston.format.json(),
    myFormat,
    format.splat(),
    format.printf((info) => {
      if (typeof info.message === "object") {
        info.message = JSON.stringify(info.message, null, 3);
      }
      return `${info.timestamp} [${info.level}]: ${info.message}`;
    })
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.Console(),
    // new winston.transports.File({ filename: "error.log", level: "error" }),
    // new winston.transports.File({ filename: "combined.log" }),
  ],
});

module.exports = logger;
