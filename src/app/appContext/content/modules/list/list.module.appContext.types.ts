// src/app/appContext/content/modules/list/list.module.appContext.types.ts

import type { ContentInlineResolved } from "@app/appContext/content/inline-content/inline-content.types";

export type AppContextListItem = {
  content: readonly ContentInlineResolved[];
};

export type AppContextListModule = {
  kind: "list";
  style: "unordered" | "ordered";
  items: readonly AppContextListItem[];
};
