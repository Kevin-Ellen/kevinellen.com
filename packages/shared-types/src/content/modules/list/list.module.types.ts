// packages/shared-types/src/content/modules/list/list.module.types.ts

import type { ContentInlineAuthored } from "@shared-types/content/inline-content/inline-content.types";

export type ListItemModuleAuthored = {
  content: readonly ContentInlineAuthored[];
};

export type ListModuleAuthored = {
  kind: "list";
  style?: "unordered" | "ordered";
  items: readonly ListItemModuleAuthored[];
};
