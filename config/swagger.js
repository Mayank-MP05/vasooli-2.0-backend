const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const applySwaggerUI = (app) => {
  // Extended: https://swagger.io/specification/#infoObject
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "Vasooli API",
        description: "Vasooli - Money Manager API Docs",
        contact: {
          name: "mayank",
        },
        servers: ["http://localhost:8000"],
      },
    },
    // ['.routes/*.js']
    apis: ["server.js", "./routes/*.js"],
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = applySwaggerUI;
