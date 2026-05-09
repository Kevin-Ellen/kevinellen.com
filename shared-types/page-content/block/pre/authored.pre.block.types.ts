// shared-types/page-content/block/pre/authored.pre.block.types.ts

import type { AuthoredBaseBlock } from "@shared-types/page-content/block/base/authored.base.block.types";

export type AuthoredPreBlock = AuthoredBaseBlock<
  "pre",
  {
    value: string;
  }
>;
