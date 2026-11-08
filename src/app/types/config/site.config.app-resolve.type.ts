// src/app/types/config/site.config.app-resolve.type.ts

import type { SiteConfigAppInit } from "../../../shared/types/config/site.config.shared.app-init.type";

export type SiteConfigAppResolve = Readonly<
  Omit<SiteConfigAppInit, "titleSuffix" | "description" | "name">
>;
