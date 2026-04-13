// shared-types/page-content/block/list/authored.list.block.page-content.types.ts

import type { AuthoredInlineContent } from "@shared-types/page-content/inline/authored.inline-content.page-content.types";

import type { BlockContentModuleListStyle } from "@shared-types/page-content/block/shared.block.content.types";

export type AuthoredListItemBlockContentModule = Readonly<{
  content: readonly AuthoredInlineContent[];
}>;

export type AuthoredListBlockContentModule = Readonly<{
  kind: "list";
  style?: BlockContentModuleListStyle;
  items: readonly AuthoredListItemBlockContentModule[];
}>;
