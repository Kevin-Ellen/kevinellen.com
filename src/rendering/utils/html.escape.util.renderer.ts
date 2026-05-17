// src/rendering/utils/html.escape.util.renderer.ts

export const escapeJsonScriptContent = (value: string): string =>
  value
    .replace(/</g, "\\u003C")
    .replace(/>/g, "\\u003E")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
