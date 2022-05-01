const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const applySwaggerUI = (app) => {
  // Extended: https://swagger.io/specification/#infoObject
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "Customer API",
        description: "Customer API Information",
        contact: {
          name: "Amazing Developer",
        },
        servers: ["http://localhost:5000"],
      },
    },
    // ['.routes/*.js']
    apis: ["server.js"],
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = { applySwaggerUI };
