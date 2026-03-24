// src/app/rendering/renderer/utils/escapreAttribute.util.renderer.ts

export const escapeAttribute = (value: string): string => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("'", "&#39;");
};
