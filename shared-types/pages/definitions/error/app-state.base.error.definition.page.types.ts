// shared-types/pages/definitions/app-state.base.error.definition.page.types.ts

import type { AuthoredErrorPageDefinition } from "@shared-types/pages/definitions/error/authored.base.error.definition.page.types";
import type { PageIdError } from "@shared-types/pages/shared/id.shared.page.types";

export type AppStateErrorPageDefinition = AuthoredErrorPageDefinition & {
  breadcrumbs: ["home", PageIdError];
};
