// shared-types/pages/definitions/public/base/app-context.base.public.definition.page.types.ts

import type { AppStatePublicBasePageDefinition } from "@shared-types/pages/definitions/public/base/app-state.base.public.definition.page.types";

export type AppContextPublicBasePageDefinition = Omit<
  AppStatePublicBasePageDefinition,
  "robotsTxt" | "sitemapXml"
>;
