const express = require("express");
const logger = require("../config/logger");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
// Database Connection Handlers
const notifDB = require("../config/mongo-db-connect");
const vasooliDB = require("../config/mysql-connect");
const requestLogger = require("../middleware/request-logger");

/**
 * @swagger
 * /user/login:
 *  post:
 *    tags:
 *    - "user"
 *    summary: "Logs In user to the system give JWT Token along with User Model"
 *    description: "Returns a JWT Token,Success or Error and Message,User Model"
 *    operationId: "/user/login"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "body"
 *      name: "body"
 *      description: "user login credentials"
 *      required: true
 *      schema:
 *        type: "object"
 *        properties:
 *          username:
 *            type: "string"
 *            example: "one@mail.com"
 *          password:
 *            type: "string"
 *            example: "onepass"
 *    responses:
 *      "200":
 *        description: "Login Success"
 */
userRouter.post("/login", requestLogger, (req, res) => {
  const { body } = req;
  const { username, password } = body;

  //TODO: Check if user exists in DB
  vasooliDB.query(
    "SELECT * FROM users WHERE email = ?",
    [username],
    (err, results) => {
      logger.info("%o %o", err, results);
      if (err || results.length === 0) {
        res.status(400).send({
          message: "User do not exist in our system",
          success: false,
          error: true,
          ...err,
        });
      }

      //TODO: Check if password is correct
      const [user, ...rest] = results;
      if (user.password !== password) {
        res.status(401).send({
          message: "Password you entered is Incorrect",
          success: false,
          error: true,
        });
      } else {
        //TODO: Create JWT Token and Nullify the Password send it back
        user.password = null;
        const accessToken = jwt.sign(user, "secret");
        res.status(200).send({
          message: "Successfully Logged In",
          success: true,
          error: false,
          token: accessToken,
          ...user,
        });
      }
    }
  );
});

/**
 * @swagger
 * /user/register:
 *  post:
 *    tags:
 *    - "user"
 *    summary: "Register new user into the system ,give JWT Token, Status"
 *    description: "Returns a JWT Token, Success or Error Message, User Model"
 *    operationId: "/user/register"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "body"
 *      name: "body"
 *      description: "User Signup Credentials"
 *      required: true
 *      schema:
 *        type: "object"
 *        properties:
 *          username:
 *            type: "string"
 *            example: "two@mail.com"
 *          password:
 *            type: "string"
 *            example: "twopass"
 *          fullName:
 *            type: "string"
 *            example: "User Two"
 *          city:
 *            type: "string"
 *            example: "pune"
 *    responses:
 *      "200":
 *        description: "SignUp Success"
 */
userRouter.post("/register", requestLogger, (req, res) => {
  const { body } = req;
  const { username, password, fullName, city } = body;
  const user = { username, password };
  const randomProfilePic = Math.floor(Math.random() * 9);

  //TODO: Check if user exists in DB
  vasooliDB.query(
    "INSERT INTO users (email,password,profilePic,fullName, city) VALUES (?,?,?,?,?)",
    [username, password, randomProfilePic, fullName, city],
    (err, results) => {
      logger.info("%o %o", err, results);
      if (err) {
        res.status(400).send({
          message: "Something went wrong, Please try again",
          success: false,
          error: true,
          ...err,
        });
      }

      //TODO: Create JWT Token and Nullify the Password send it back
      if (results && results.insertId) {
        const accessToken = jwt.sign(user, "secret");
        res.status(200).send({
          message: "Account Successfully Created!!",
          success: true,
          error: false,
          userId: results.insertId,
          username,
          token: accessToken,
          profilePic: randomProfilePic,
          fullName,
          city,
        });
      }
    }
  );
});

/**
 * @swagger
 * /user/logout/{userId}:
 *  get:
 *    tags:
 *    - "user"
 *    summary: "Logs Out the User"
 *    description: "logout the user"
 *    operationId: "/user/logout"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "path"
 *      name: "userId"
 *      description: "numeric userId in the DB"
 *      required: true
 *      type: "integer"
 *      format: "int64"
 *    responses:
 *      "200":
 *        description: "LogOut Success"
 */
userRouter.get("/logout/:id", requestLogger, (req, res) => {
  const { id } = req.params;
  res.send("Logout successfull! for user id: " + id);
});

/**
 * @swagger
 * /user/editProfile:
 *  post:
 *    tags:
 *    - "user"
 *    summary: "Update the Profile in DB according to req body input"
 *    description: "Update the Profile in DB according to req body input"
 *    operationId: "/user/editProfile"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "body"
 *      name: "body"
 *      description: "Edit Profile Updated Credentials"
 *      required: true
 *      schema:
 *        type: "object"
 *        properties:
 *          username:
 *            type: "string"
 *            example: "one@mail.com"
 *          fullName:
 *            type: "string"
 *            example: "user oneMOD"
 *          profilePic:
 *            format: "int64"
 *            example: 6
 *          city:
 *            type: "string"
 *            example: "sample city"
 *
 *    responses:
 *      "200":
 *        description: "UpdateProfile Success"
 */
userRouter.post("/editProfile", requestLogger, (req, res) => {
  const { body } = req;
  const { username, fullName, city, profilePic } = body;

  //TODO: DB Query to update the record
  vasooliDB.query(
    `UPDATE users
    SET profilePic = ?,
    fullName = ?,
    city = ?
    WHERE email = ?`,
    [profilePic, fullName, city, username],
    (err, results) => {
      logger.info("%o %o", err, results);
      if (err) {
        res.status(400).send({
          message: "Something went wrong, Please try again",
          success: false,
          error: true,
          ...err,
        });
      }

      res.status(200).send({
        message: "Profile details updated successfully!!",
        success: true,
        error: false,
        ...results,
      });
    }
  );
});

module.exports = userRouter;
