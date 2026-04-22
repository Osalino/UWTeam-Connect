// Entry point for the development server
// import { createServer } from "./server.ts";
// import { prisma } from "./data/db.ts";
//
// const PORT = 3000;
// const app = createServer();
//
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
//
//
//

import "dotenv/config"; // Load environment variables from .env file
import { createServer } from "./server";

const PORT = 3000;
const app = createServer(); // Build the Express app with all routes and middleware

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});