// shared-types/page-content/block/base/app-state.base.block.page-content.types.ts

import type { BlockContentModuleFlow } from "@shared-types/page-content/block/shared.block.content.types";

export type AppStateBaseBlockContentModule<
  K extends string,
  Fields extends object = object,
> = Readonly<{
  kind: K;
  flow: BlockContentModuleFlow;
}> &
  Readonly<Fields>;
