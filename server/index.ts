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

import { createServer } from "./server";

const PORT = 3000;
const app = createServer();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});