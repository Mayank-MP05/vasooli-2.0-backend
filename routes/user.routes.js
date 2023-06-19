const express = require("express");
const logger = require("../config/logger");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
// Database Connection Handlers
const notifDB = require("../config/mongo-db-connect");
const vasooliDB = require("../config/mysql-connect");
const requestLogger = require("../middleware/request-logger");
const createNotification = require("../services/notification.service");
const passwordValidations = require("../utils/validations");

/**
 * @swagger
 * /user/login:
 *  post:
 *    tags:
 *    - "User"
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
 *          email:
 *            type: "string"
 *            example: "one@mail.com"
 *          password:
 *            type: "string"
 *            example: "onepass"
 *    responses:
 *      "200":
 *        description: "Login Success"
 */
userRouter.post("/login", requestLogger, (request, response) => {
  const { body } = request;
  const { email, password } = body;
  const userForToken = { email, password };

  //TODO: Check if user exists in DB
  vasooliDB.query(
    "SELECT * FROM customers WHERE email_id = ? LIMIT 1;",
    [email],
    (error, customerRecords) => {
      if (error || customerRecords.length === 0) {
        response.status(200).send({
          message: "User do not exist in our system",
          statusCode: 4001,
          ...error,
        });
      }

      //TODO: Check if password is correct
      const customer = customerRecords[0];
      if (customer && customer.password_hash && customer.password_hash === password) {
        //TODO: Create JWT Token and Nullify the Password send it back
        customer.password_hash = null;
        const accessToken = jwt.sign(userForToken, "secret");
        response.status(200).send({
          message: "Successfully Logged In",
          statusCode: 2000,
          authorization: accessToken,
          ...customer,
          password_hash: undefined,
          username: customer.first_name,
        });
      } else {
        response.status(200).send({
          message: "Password you entered is incorrect, Please try again",
          statusCode: 2000,
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
 *    - "User"
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
 *          emailId:
 *            type: "string"
 *            example: "two@mail.com"
 *          password:
 *            type: "string"
 *            example: "twopass"
 *          confirmPassword:
 *            type: "string"
 *            example: "twopass"
 *          city:
 *            type: "string"
 *            example: "pune"
 *    responses:
 *      "200":
 *        description: "SignUp Success"
 */
userRouter.post("/register", requestLogger, (request, response) => {
  const { body } = request;
  const { email, password, confirmPassword } = body;
  const customer = { email, password };
  const randomProfilePic = Math.floor(Math.random() * 9);

  if (password !== confirmPassword) {
    response.status(400).send({
      message: "Password and Confirm Password do not match",
      statusCode: 4002,
    });
  }

  if (password === confirmPassword) {
    // Check for password strength by rules
    const passwordStrengthCheckResults = passwordValidations(password);
    if (passwordStrengthCheckResults.statusCode !== 2000) {
      response.status(400).send({
        ...passwordStrengthCheckResults,
      });
    }
  }

  //TODO: Check if user exists in DB
  vasooliDB.query(
    "INSERT INTO customers (email_id,password_hash) VALUES (?,?)",
    [email, password],
    (err, results) => {
      logger.info("%o %o", err, results);
      if (err) {
        response.status(400).send({
          message: "Something went wrong, Please try again",
          statusCode: 4000,
          ...err,
        });
      }

      //TODO: Create JWT Token and Nullify the Password send it back
      if (results && results.insertId) {
        const accessToken = jwt.sign(customer, "secret");
        //TODO: Send notifications as Joining
        createNotification({
          priority: 2,
          content: `${email} has just joined vasooli money manager app!`,
          timestamp: new Date(),
        });
        response.status(200).send({
          message: "Account Successfully Created!!",
          statusCode: 2000,
          emailId: email,
          customerId: results.emailId,
          authorization: accessToken,
          profilePic: randomProfilePic,
          username: results.first_name,
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
 *    - "User"
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
 *    - "User"
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
userRouter.post("/edit-profile", requestLogger, (request, response) => {
  const { body } = request;
  const { username, fullName, city, profilePic } = body;

  //TODO: DB Query to update the record
  vasooliDB.query(
    `UPDATE customers
    SET profilePic = ?,
    fullName = ?,
    city = ?
    WHERE email = ?`,
    [profilePic, fullName, city, username],
    (err, results) => {
      if (err) {
        response.status(400).send({
          message: "Something went wrong, Please try again",
          statusCode: 4000,
          ...err,
        });
      }

      response.status(200).send({
        message: "Profile details updated successfully!!",
        statusCode: 2000,
        ...results,
      });
    }
  );
});

module.exports = userRouter;
