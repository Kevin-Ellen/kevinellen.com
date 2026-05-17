// shared-types/page-content/block/base/authored.base.block.page-content.types.ts

import type { BlockFlow } from "@shared-types/page-content/block/shared.block.types";

export type AuthoredBaseBlock<
  K extends string,
  Fields extends object = object,
> = Readonly<{
  kind: K;
  flow?: BlockFlow;
}> &
  Readonly<Fields>;
