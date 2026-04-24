// shared-types/page-content/block/pre/authored.pre.block.page-content.types.ts

import type { BlockContentModuleFlow } from "@shared-types/page-content/block/shared.block.content.types";

export type AuthoredPreBlockContentModule = Readonly<{
  kind: "pre";
  value: string;
  flow?: BlockContentModuleFlow;
}>;
