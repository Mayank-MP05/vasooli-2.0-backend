const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const applySwaggerUI = (app) => {
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "2.4.0",
        title: "Vasooli API Docs",
        description: "Vasooli - Money Manager API Docs",
        contact: {
          name: "mayank",
        },
        servers: ["http://localhost:8000"],
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ["server.js", "./routes/*.js"],
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = applySwaggerUI;
