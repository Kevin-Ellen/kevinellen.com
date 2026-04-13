// shared-types/page-content/block/hero/app-state.hero.block.page-content.types.ts

import type { BlockContentModuleFlow } from "@shared-types/page-content/block/shared.block.content.types";
import type { AuthoredHeroBlockContentModule } from "@shared-types/page-content/block/hero/authored.hero.block.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateHeroBlockContentModuleDeterministicFields = Readonly<{
  immersive: boolean;
  flow: BlockContentModuleFlow;
}>;

export type AppStateHeroBlockContentModule = Replace<
  AuthoredHeroBlockContentModule,
  AppStateHeroBlockContentModuleDeterministicFields
>;
