const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const applySwaggerUI = require("./config/swagger");
const logger = require("./config/logger");
const userRouter = require("./routes/user.routes");

// Database Handlers
const notifDB = require("./config/mongo-db-connect");
const vasooliDB = require("./config/mysql-connect");

const app = express();
const PORT = 8000;

// Default Middlewares for CORS, Json and Cookies
app.use(express.json());
app.use(cors());
app.use(cookieParser());
applySwaggerUI(app);

// import routes from routers
app.use("/user", userRouter);

app.listen(PORT, () => {
  logger.debug(`Example app listening on port ${PORT}`);
});
