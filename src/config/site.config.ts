// src/config/site.config.ts

import type { SiteConfig } from "@config/site.config.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const siteConfig: SiteConfig = deepFreeze({
  siteName: "Kevin Ellen",
  siteUrl: "https://kevinellen.com",
  language: "en-GB",
});
