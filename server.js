const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const applySwaggerUI = require("./config/swagger");
const logger = require("./config/logger");
const userRouter = require("./routes/user.routes");
require("./config/mongo-db-connect");
const app = express();
const PORT = 8000;

// Default Middlewares for CORS, Json and Cookies
app.use(express.json());
app.use(cors());
app.use(cookieParser());
applySwaggerUI(app);

// import routes from routers
app.use("/user", userRouter);

/**
 * @swagger
 * /login:
 *    post:
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
app.post("/login", (req, res) => {
  logger.debug(req.body);
  res.status(200).send("Login Route");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
