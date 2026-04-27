// PM2 config for ConoHa production
// app.instyle.group/instyle-goal-sheet/ → 127.0.0.1:3001

const fs = require("fs");
const path = require("path");

function loadEnvFile(p) {
  if (!fs.existsSync(p)) return {};
  const out = {};
  for (const line of fs.readFileSync(p, "utf-8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
  return out;
}

const envBase = loadEnvFile(path.resolve(__dirname, ".env.base"));
const envApp = loadEnvFile(path.resolve(__dirname, ".env.app"));

module.exports = {
  apps: [
    {
      name: "app-instyle-goal-sheet",
      script: "server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        ...envBase,
        ...envApp,
        NODE_ENV: "production",
        PORT: "3001",
        HOSTNAME: "127.0.0.1",
      },
    },
  ],
};
