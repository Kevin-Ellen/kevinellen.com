// shared-types/pages/definitions/error/app-state.base.error.definition.page.types.ts

import type { AuthoredErrorPageDefinition } from "@shared-types/pages/definitions/error/authored.base.error.definition.page.types";
import type { PageIdError } from "@shared-types/pages/shared/id.shared.page.types";
import type { AppStateAssets } from "@shared-types/assets/app-state.assets.types";
import type { AppStatePageContent } from "@shared-types/page-content/app-state.page-content.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateErrorPageRuntime = Readonly<{
  breadcrumbs: readonly ["home", PageIdError];
  assets: AppStateAssets;
  content: AppStatePageContent;
}>;

export type AppStateErrorPageDefinition = Replace<
  AuthoredErrorPageDefinition,
  AppStateErrorPageRuntime
>;
