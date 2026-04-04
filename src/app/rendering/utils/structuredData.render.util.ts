// src/app/rendering/utils/structuredData.render.util.ts

import type { DocumentRenderContext } from "@app/rendering/document/document.render.types";

const serialiseStructuredData = (entry: unknown): string => {
  return JSON.stringify(entry)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
};

const renderStructuredDataEntry = (entry: unknown): string => {
  return `<script type="application/ld+json">${serialiseStructuredData(entry)}</script>`;
};

export const renderStructuredData = (
  structuredData: DocumentRenderContext["structuredData"],
): string => {
  const entries = [
    structuredData.person,
    structuredData.website,
    structuredData.page,
  ].filter((entry) => {
    if (entry === null) {
      return false;
    }

    if (Array.isArray(entry) && entry.length === 0) {
      return false;
    }

    return true;
  });

  return entries.map((entry) => renderStructuredDataEntry(entry)).join("");
};
