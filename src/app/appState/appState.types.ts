// src/app/appState/appState.app.typests

import type { SiteConfig } from "@config/site.config.types";
import type { NavigationConfig } from "@config/navigation.config.types";
import type { SocialConfig } from "@config/social.config.types";
import type { StructuredDataConfig } from "@config/structured-data.config.types";
import type { AssetsConfig } from "@config/assets.config.types";
import type { FooterConfig } from "@config/footer.config.types";
import type { WebManifestConfig } from "@config/webmanifest.config.types";

export type AppStateSeed = {
  site: SiteConfig;
  navigation: NavigationConfig;
  social: SocialConfig;
  structuredData: StructuredDataConfig;
  assets: AssetsConfig;
  footer: FooterConfig;
  webmanifest: WebManifestConfig;
};
