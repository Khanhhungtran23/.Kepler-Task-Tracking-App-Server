const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Tracking Application API",
      version: "1.0.0",
      description: "API documentation for the Task Tracking system",
    },
    servers: [
      {
        url: "http://localhost:3000", // Base URL for local dev server
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
      schemas: {
        User: {
          type: "object",
          properties: {
            user_name: { type: "string", description: "The username", example: "johndoe" },
            full_name: { type: "string", description: "Full name of the user", example: "John Doe" },
            role: { type: "string", description: "Role of the user in the project", example: "Developer" },
            email: { type: "string", description: "User email address", example: "johndoe@example.com" },
            password: { type: "string", description: "User password", example: "password123" },
            isAdmin: { type: "boolean", description: "Determines if the user is an admin", example: false },
            isActive: { type: "boolean", description: "Is the account active?", example: true },
            tasks: {
              type: "array",
              items: { type: "string", description: "Task IDs assigned to the user" },
            },
          },
        },
        Task: {
          type: "object",
          properties: {
            title: { type: "string", description: "Task title", example: "Implement login functionality" },
            deadline: { type: "string", format: "date-time", description: "Task deadline", example: "2024-10-30T12:00:00Z" },
            assets: { type: "array", items: { type: "string" }, description: "Assets for the task" },
            tag: { type: "string", description: "Tag or category for the task", example: "Backend" },
          },
        },
        Notification: {
          type: "object",
          properties: {
            team: { type: "array", items: { type: "string", description: "User ID" }, description: "List of team members" },
            text: { type: "string", description: "Notification text", example: "New task assigned to you" },
            application: { type: "string", description: "Application ID", example: "603d2149e6c5c019d4fbdbd4" },
            notiType: { type: "string", enum: ["alert", "message"], description: "Type of notification", example: "alert" },
            isRead: { type: "array", items: { type: "string" }, description: "List of users who have read the notification" },
          },
        },
        Application: {
          type: "object",
          properties: {
            title: { type: "string", description: "Application title", example: "Task Management System" },
            description: { type: "string", description: "Application description", example: "Tracks tasks and team activities" },
            assets: { type: "array", items: { type: "string" }, description: "Assets related to the application" },
            status: { type: "string", enum: ["To Do", "Implementing", "Testing", "Go Live"], description: "Current status of the application", example: "To Do" },
            isTrashed: { type: "boolean", description: "Is the application in trash?", example: false },
            priority: { type: "integer", description: "Application priority", example: 1 },
            tasks: { type: "array", items: { type: "string" }, description: "List of tasks in the application" },
            activities: { type: "array", items: { type: "string" }, description: "List of activities" },
            teamMembers: { type: "array", items: { type: "string" }, description: "List of team members" },
          },
        },
        Activity: {
          type: "object",
          properties: {
            title: {
              type: "string",
              enum: ["Requirement Clarification", "Implementation", "QC1", "UAT", "QC2", "Deployment"],
              description: "Activity title",
              example: "Implementation",
            },
            comment: { type: "string", description: "Comment for the activity", example: "Code for the login functionality has been implemented." },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"], // Path to the route files
};

export default swaggerOptions;
