// src/app/rendering/utils/structuredData.render.util.ts

import type { StructuredDataNode } from "@shared-types/structured-data/structured-data.nodes.types";

import { escapeAttribute } from "@app/rendering/utils/escapeContent.util";

export const renderStructuredDataNode = (
  node: StructuredDataNode,
  nonce: string,
): string => {
  return `<script type="application/ld+json" nonce="${escapeAttribute(nonce)}">${JSON.stringify(node)}</script>`;
};
