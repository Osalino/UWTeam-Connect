import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "node",
    include: ["testing/**/*.test.{ts,tsx}"],
    exclude: ["testing/e2e/**"],
    setupFiles: ["testing/setup.ts"],
    environmentMatchGlobs: [["testing/component/**", "jsdom"]],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
});
