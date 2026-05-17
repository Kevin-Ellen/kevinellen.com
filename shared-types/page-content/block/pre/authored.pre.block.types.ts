// shared-types/page-content/block/pre/authored.pre.block.types.ts

import type { AuthoredBaseBlock } from "@shared-types/page-content/block/base/authored.base.block.types";
import type { CodeLanguage } from "@shared-types/page-content/shared/code/authored.code.shared.types";

export type AuthoredPreBlock = AuthoredBaseBlock<
  "pre",
  {
    value: string;
    language?: CodeLanguage;
  }
>;
