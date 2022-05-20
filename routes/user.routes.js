const express = require("express");
const logger = require("../config/logger");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
// Database Connection Handlers
const notifDB = require("../config/mongo-db-connect");
const vasooliDB = require("../config/mysql-connect");

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
userRouter.post("/login", (req, res) => {
  const { body } = req;
  const { username, password } = body;
  logger.debug({ username, password });

  //TODO: Check if user exists in DB
  vasooliDB.query(
    "SELECT * FROM users WHERE email = ?",
    [username],
    (err, results) => {
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
 *    responses:
 *      "200":
 *        description: "SignUp Success"
 */
userRouter.post("/register", (req, res) => {
  res.send("Register Route for user");
});

/**
 * @swagger
 * /user/logout:
 *  post:
 *    tags:
 *    - "user"
 *    summary: "Logs Out the User"
 *    description: "logout the user"
 *    operationId: "/user/logout"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "body"
 *      name: "body"
 *      description: "user logout credentials"
 *      required: true
 *      schema:
 *        type: "object"
 *        properties:
 *          username:
 *            type: "string"
 *            example: "one@gmail.com"
 *    responses:
 *      "200":
 *        description: "LogOut Success"
 */
userRouter.post("/logout", (req, res) => {
  res.send("Logout Route for user");
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
 *          fullName:
 *            type: "string"
 *            example: "user one"
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
userRouter.post("/editProfile", (req, res) => {
  res.send("editProfile Route for user");
});

module.exports = userRouter;
