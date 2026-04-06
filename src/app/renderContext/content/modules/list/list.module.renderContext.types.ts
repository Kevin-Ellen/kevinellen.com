// src/app/renderContext/content/modules/list/list.module.renderContext.types.ts

import type { ContentInlineResolved } from "@app/renderContext/content/inline-content/inline-content.types";

export type RenderContextListItem = {
  content: readonly ContentInlineResolved[];
};

export type RenderContextListModule = {
  kind: "list";
  style: "unordered" | "ordered";
  items: readonly RenderContextListItem[];
};
