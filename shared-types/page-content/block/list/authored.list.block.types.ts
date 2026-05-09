// shared-types/page-content/block/list/authored.list.block.types.ts

import type { AuthoredInline } from "@shared-types/page-content/inline/authored.inline-content.types";

import type { BlockListStyle } from "@shared-types/page-content/block/shared.block.types";
import type { AuthoredBaseBlock } from "@shared-types/page-content/block/base/authored.base.block.types";

export type AuthoredListItemBlock = Readonly<{
  content: readonly AuthoredInline[];
}>;

export type AuthoredListBlock = AuthoredBaseBlock<
  "list",
  {
    style?: BlockListStyle;
    items: readonly AuthoredListItemBlock[];
  }
>;
