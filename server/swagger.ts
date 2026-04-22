// Served at /api-docs via swagger-ui-express
export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "UWTeam Connect API",
    version: "1.0.0",
    description: "REST API for the Unshaken Worship Team management system.",
  },
  servers: [{ url: "http://localhost:3000" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/api/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        security: [],
        requestBody: {
          content: {
            "application/json": {
              example: { username: "john", password: "secret123", role: "member" },
            },
          },
        },
        responses: { 201: { description: "User created" }, 400: { description: "Invalid input" }, 409: { description: "Username taken" } },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and receive a JWT token",
        security: [],
        requestBody: {
          content: {
            "application/json": {
              example: { username: "john", password: "secret123" },
            },
          },
        },
        responses: { 200: { description: "Login successful, returns token" }, 401: { description: "Invalid credentials" } },
      },
    },
    "/api/announcements": {
      get: {
        tags: ["Announcements"],
        summary: "Get all announcements",
        responses: { 200: { description: "List of announcements" }, 401: { description: "Unauthorised" } },
      },
      post: {
        tags: ["Announcements"],
        summary: "Create an announcement",
        requestBody: {
          content: {
            "application/json": {
              example: { title: "Team Meeting", description: "5pm in the hall", category: "General" },
            },
          },
        },
        responses: { 201: { description: "Created" }, 400: { description: "Invalid input" } },
      },
    },
    "/api/announcements/{id}": {
      put: {
        tags: ["Announcements"],
        summary: "Update an announcement",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "application/json": {
              example: { title: "Updated Title", description: "Updated text", category: "General" },
            },
          },
        },
        responses: { 200: { description: "Updated" }, 400: { description: "Invalid ID or input" } },
      },
      delete: {
        tags: ["Announcements"],
        summary: "Delete an announcement",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 204: { description: "Deleted" }, 400: { description: "Invalid ID" } },
      },
    },
    "/api/events": {
      get: {
        tags: ["Events"],
        summary: "Get all events",
        responses: { 200: { description: "List of events" }, 401: { description: "Unauthorised" } },
      },
      post: {
        tags: ["Events"],
        summary: "Create an event",
        requestBody: {
          content: {
            "application/json": {
              example: { name: "Sunday Service", date: "2025-12-25T10:00:00Z", location: "Main Hall" },
            },
          },
        },
        responses: { 201: { description: "Created" }, 400: { description: "Invalid input" } },
      },
    },
    "/api/events/{id}": {
      put: {
        tags: ["Events"],
        summary: "Update an event",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "application/json": {
              example: { name: "Updated Event", date: "2025-12-25T10:00:00Z" },
            },
          },
        },
        responses: { 200: { description: "Updated" }, 400: { description: "Invalid ID or input" } },
      },
      delete: {
        tags: ["Events"],
        summary: "Delete an event",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 204: { description: "Deleted" }, 400: { description: "Invalid ID" } },
      },
    },
    "/api/team-members": {
      get: {
        tags: ["Team Members"],
        summary: "Get all team members",
        responses: { 200: { description: "List of team members" }, 401: { description: "Unauthorised" } },
      },
    },
    "/api/team-members/{id}": {
      put: {
        tags: ["Team Members"],
        summary: "Update a team member role or status",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "application/json": {
              example: { role: "leader", status: "active" },
            },
          },
        },
        responses: { 200: { description: "Updated" }, 400: { description: "Invalid ID" } },
      },
      delete: {
        tags: ["Team Members"],
        summary: "Delete a team member",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 204: { description: "Deleted" }, 400: { description: "Invalid ID" } },
      },
    },
  },
};
