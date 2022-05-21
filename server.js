const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const applySwaggerUI = require("./config/swagger");
const logger = require("./config/logger");

// Database Connections Handlers
const notifDB = require("./config/mongo-db-connect");
const vasooliDB = require("./config/mysql-connect");

// Routers import
const userRouter = require("./routes/user.routes");
const txnsRouter = require("./routes/transactions.routes");
const vasooliRouter = require("./routes/vasooli.routes");
const notifRouter = require("./routes/notifications.routes");

const app = express();
const PORT = 8000;

// Default Middlewares for CORS, Json and Cookies
app.use(express.json());
app.use(cors());
app.use(cookieParser());
applySwaggerUI(app);

// Route Mapping to respective routers
app.use("/user", userRouter);
app.use("/transactions", txnsRouter);
app.use("/vasooli", vasooliRouter);
app.use("/notif", notifRouter);

app.listen(PORT, () => {
  logger.debug(`[SERVER]: Example app listening on port ${PORT}`);
});
