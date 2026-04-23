// shared-types/page-content/block/content-section/app-state.content-section.block.page-content.types.ts

import type {
  AuthoredContentSectionHeadingBlockContentModule,
  AuthoredContentSectionBlockContentModule,
} from "@shared-types/page-content/block/content-section/authored.content-section.block.page-content.types";
import type { AppStateBlockContentModule } from "@shared-types/page-content/block/app-state.block.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateContentSectionHeadingBlockContentModuleDeterministicFields =
  Readonly<{
    visuallyHidden: boolean;
  }>;

export type AppStateContentSectionHeadingBlockContentModule = Replace<
  AuthoredContentSectionHeadingBlockContentModule,
  AppStateContentSectionHeadingBlockContentModuleDeterministicFields
>;

type AppStateContentSectionBlockContentModuleDeterministicFields = Readonly<{
  heading: AppStateContentSectionHeadingBlockContentModule;
  modules: readonly AppStateBlockContentModule[];
}>;

export type AppStateContentSectionBlockContentModule = Replace<
  AuthoredContentSectionBlockContentModule,
  AppStateContentSectionBlockContentModuleDeterministicFields
>;
