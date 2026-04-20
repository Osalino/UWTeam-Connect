import { spawn } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isWindows = process.platform === "win32";

// On Windows, use node.exe directly with the tsx/vite CLI modules
// This avoids .cmd wrappers which break when the path has spaces
function getBin(name) {
  if (isWindows) {
    // Find the CLI entry point for the package directly
    const pkgMain = resolve(__dirname, `node_modules/${name}/dist/cli.mjs`);
    return [process.execPath, pkgMain];
  }
  return [resolve(__dirname, `node_modules/.bin/${name}`), []];
}

function run(cmd, args, label) {
  console.log(`[${label}] Starting...`);

  let finalCmd, finalArgs;
  if (isWindows) {
    // Use node.exe + CLI module path to avoid .cmd issues with spaces in path
    const cliMap = {
      tsx: resolve(__dirname, "node_modules/tsx/dist/cli.mjs"),
      vite: resolve(__dirname, "node_modules/vite/bin/vite.js"),
    };
    finalCmd = process.execPath;
    finalArgs = [cliMap[cmd], ...args];
  } else {
    finalCmd = resolve(__dirname, `node_modules/.bin/${cmd}`);
    finalArgs = args;
  }

  const proc = spawn(finalCmd, finalArgs, {
    stdio: "pipe",
    shell: false,
    cwd: __dirname,
  });

  proc.stdout.on("data", (d) =>
    process.stdout.write(`[${label}] ${d.toString()}`)
  );
  proc.stderr.on("data", (d) =>
    process.stderr.write(`[${label}] ${d.toString()}`)
  );
  proc.on("close", (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[${label}] exited with code ${code}`);
      process.exit(code);
    }
  });
  return proc;
}

const server = run("tsx", ["watch", "server/index.ts"], "server");
const client = run("vite", [], "client");

process.on("SIGINT", () => {
  server.kill();
  client.kill();
  process.exit(0);
});
