// shared-types/page-content/block/pre/authored.pre.block.page-content.types.ts

import type { AuthoredBaseBlockContentModule } from "@shared-types/page-content/block/base/authored.base.block.page-content.types";

export type AuthoredPreBlockContentModule = AuthoredBaseBlockContentModule<
  "pre",
  {
    value: string;
  }
>;
