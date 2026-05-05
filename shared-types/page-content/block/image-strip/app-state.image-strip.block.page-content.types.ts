// shared-types/page-content/block/image-strip/app-state.image-strip.block.page-content.types.ts

import type { AuthoredImageStripBlockContentModule } from "@shared-types/page-content/block/image-strip/authored.image-strip.block.page-content.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateImageStripBlockContentModuleDeterministicFields = Readonly<{
  strategy: "dailyRandom";
  itemCount: number;
  excludePagePhotos: boolean;
}>;

export type AppStateImageStripBlockContentModule = Replace<
  AuthoredImageStripBlockContentModule,
  AppStateImageStripBlockContentModuleDeterministicFields
>;
