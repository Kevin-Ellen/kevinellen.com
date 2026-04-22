// src/rendering/utils/html.escape.util.renderer.ts

export const escapeHtml = (value: string): string => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
};

export const escapeAttribute = (value: string): string => {
  return escapeHtml(value);
};
