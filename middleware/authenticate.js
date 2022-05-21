const jwt = require("jsonwebtoken");
const vasooliDB = require("../config/mysql-connect");

const authenticate = (req, res, next) => {
  const authorization = (req.headers && req.headers.authorization) || "";
  const token = authorization.split(" ")[1];

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      res.status(401).json({
        error: true,
        message: "Invalid Token",
      });
    }
    vasooliDB.query(
      "SELECT * FROM users WHERE email = ?",
      [decoded.username],
      (err, results) => {
        if (err || results.length === 0) {
          res.status(401).json({
            error: true,
            message: "Credentials not valid",
          });
        }
        req.user = results[0];
      }
    );
  });
  next();
};

module.exports = authenticate;
