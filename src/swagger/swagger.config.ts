const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: ".Kepler API",
      version: "1.0.0",
      description: "API documentation for the .Kepler - Task Tracking system",
      termsOfService: "http://swagger.io/terms/",
      license: {
        name: "Apache License, Version 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html",
      },
    },
    externalDocs: {
      description: "Find out more about Swagger",
      url: "http://swagger.io",
    },
    servers: [
      {
        url: "https://kepler.up.railway.app/api",
        description: "Deployment server at Railway.app",
      },
      {
        url: "https://kepler-api.onrender.com/api",
        description: "Deployment server at Render.com",
      },
      {
        url: "http://localhost:8080/api",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Default",
        description: "Default API endpoint",
      },
      {
        name: "Users",
        description: "Endpoints for user management",
      },
      {
        name: "Applications",
        description: "Endpoints for managing applications",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["src/docs/swagger/**/*.yaml"],
};

export default swaggerOptions;
