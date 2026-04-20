// shared-types/pages/definitions/app-state.base.error.definition.page.types.ts

import type { AuthoredErrorPageDefinition } from "@shared-types/pages/definitions/error/authored.base.error.definition.page.types";
import type { PageIdError } from "@shared-types/pages/shared/id.shared.page.types";

import type { AppStateAssets } from "@shared-types/assets/app-state.assets.types";

type AppStateErrorPageRuntime = Readonly<{
  breadcrumbs: readonly ["home", PageIdError];
  assets: AppStateAssets;
}>;

export type AppStateErrorPageDefinition = Readonly<
  AuthoredErrorPageDefinition & AppStateErrorPageRuntime
>;
