const { spawn } = require("node:child_process");
const path = require("node:path");

const backend = path.join(__dirname, "backend");
const api = spawn(process.execPath, [path.join(backend, "server.js")], {
  cwd: backend,
  stdio: "inherit",
});

const frontend = path.join(__dirname, "frontend");
const angularCli = path.join(
  frontend,
  "node_modules",
  "@angular",
  "cli",
  "bin",
  "ng.js",
);
const site = spawn(process.execPath, [angularCli, "serve"], {
  cwd: frontend,
  stdio: "inherit",
});

function encerrar() {
  api.kill();
  site.kill();
}

process.on("SIGINT", encerrar);
process.on("SIGTERM", encerrar);
api.on("exit", (code) => {
  if (code) console.error("Backend encerrou com código " + code + ".");
});
site.on("exit", (code) => {
  if (code) console.error("Frontend encerrou com código " + code + ".");
});
