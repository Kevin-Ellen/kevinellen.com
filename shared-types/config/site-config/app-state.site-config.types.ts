// src/app-state/types/site-config.app-state.types.ts

import type { AuthoredSiteConfig } from "@shared-types/config/site-config/authored.site-config.types";

export type AppStateSiteConfig = AuthoredSiteConfig & {
  origin: string;
  host: string;
};
