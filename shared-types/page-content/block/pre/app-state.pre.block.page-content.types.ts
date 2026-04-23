// shared-types/page-content/block/pre/app-state.pre.block.page-content.types.ts

import type { BlockContentModuleFlow } from "@shared-types/page-content/block/shared.block.content.types";
import type { AuthoredPreBlockContentModule } from "@shared-types/page-content/block/pre/authored.pre.block.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStatePreBlockContentModuleDeterministicFields = Readonly<{
  flow: BlockContentModuleFlow;
}>;

export type AppStatePreBlockContentModule = Replace<
  AuthoredPreBlockContentModule,
  AppStatePreBlockContentModuleDeterministicFields
>;
