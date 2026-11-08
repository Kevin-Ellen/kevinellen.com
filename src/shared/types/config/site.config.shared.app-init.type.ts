// src/shared/types/config/site.config.shared.app-init.type.ts

import type { SiteConfigAuthored } from "./site.config.shared.authored.type";

export type SiteConfigAppInit = SiteConfigAuthored &
  Readonly<{
    canonicalDomain: string;
  }>;
