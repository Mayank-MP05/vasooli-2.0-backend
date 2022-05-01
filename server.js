const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const applySwaggerUI = require("./config/swagger");
const logger = require("./config/logger");

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 8000;

applySwaggerUI(app);

/**
 * @swagger
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
app.get("/", (req, res) => {
  res.send("Hello World!");
  logger.info("Hello World!");
});

// Routes
/**
 * @swagger
 * /customers:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.get("/customers", (req, res) => {
  res.status(200).send("Customer results");
});

/**
 * @swagger
 * /customers:
 *    put:
 *      description: Use to return all customers
 *    parameters:
 *      - name: customer
 *        in: query
 *        description: Name of our customer
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully created user
 */
app.put("/customer", (req, res) => {
  res.status(200).send("Successfully updated customer");
});

/**
 * @swagger
 * /login:
 *    put:
 *      description: login the existing user to system
 *    parameters:
 *      - username: user_one
 *        in: query
 *        description: Username to login
 *        required: true
 *        schema:
 *          type: string
 *          format: string *
 *      - password: pass_one
 *        in: query
 *        description: Password to login
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully logged in user
 */
app.post("/login", (req, res) => {
  res.status(200).send("Login Route");
});

/**
 * @swagger
 * /customers:
 *    put:
 *      description: Use to return all customers
 *    parameters:
 *      - name: customer
 *        in: query
 *        description: Name of our customer
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully created user
 */
app.put("/customer", (req, res) => {
  res.status(200).send("Successfully updated customer");
});

/**
 * @swagger
 * /customers:
 *    put:
 *      description: Use to return all customers
 *    parameters:
 *      - name: customer
 *        in: query
 *        description: Name of our customer
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully created user
 */
app.put("/customer", (req, res) => {
  res.status(200).send("Successfully updated customer");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
