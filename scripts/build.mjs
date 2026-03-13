import { build } from "esbuild";
import fs from "fs";

const outdir = "dist";
fs.mkdirSync(outdir, { recursive: true });

await build({
  entryPoints: ["src/entry.ts"],
  outfile: `${outdir}/entry.js`,
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
