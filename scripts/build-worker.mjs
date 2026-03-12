import { build } from "esbuild"
import fs from "fs"

const env = process.argv[2]

if (!env) {
  console.error("Missing env: dev | stg | prod")
  process.exit(1)
}

const outdir = `dist/${env}`
fs.mkdirSync(outdir, { recursive: true })

await build({
  entryPoints: ["src/entry.ts"],
  outfile: `${outdir}/entry.js`,
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  sourcemap: true,
  minify: env === "prod",
})
