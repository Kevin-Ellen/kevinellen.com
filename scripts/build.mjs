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
