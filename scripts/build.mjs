import { build } from "esbuild";
import fs from "fs";
import path from "path";

const distDir = "dist";
const workerDir = path.join(distDir, "worker");
const staticSourceDir = "static";
const staticDistDir = path.join(distDir, "static");

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(workerDir, { recursive: true });

await build({
  entryPoints: ["src/entry.ts"],
  outfile: path.join(workerDir, "entry.js"),
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  sourcemap: true,
  minify: true,
  loader: {
    ".css": "text",
  },
});

if (fs.existsSync(staticSourceDir)) {
  fs.cpSync(staticSourceDir, staticDistDir, { recursive: true });
}
// Generate deploy wrangler config
const wranglerDeployConfig = {
  name: "kevinellen-com-dev",
  main: "./worker/entry.js",
  compatibility_date: "2025-03-12",
  observability: {
    enabled: true,
  },
  assets: {
    directory: "./static",
    binding: "ASSETS",
  },
  vars: {
    APP_ENV: "dev",
    APP_HOST: "dev.kevinellen.com",
  },
  kv_namespaces: [
    { binding: "KV_PHOTOS", id: "d1e669cba9854eee8d68569082dd5e79" },
    { binding: "KV_ARTICLES", id: "773d0f0582124523aa5e933023bc14a6" },
    { binding: "KV_JOURNALS", id: "3efdd60966574a53b9e3f2d9a6685344" },
  ],
};

fs.writeFileSync(
  path.join(distDir, "wrangler.deploy.json"),
  JSON.stringify(wranglerDeployConfig, null, 2),
);
