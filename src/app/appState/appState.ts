// src/app/appState/appState.app.ts

import type { AppStateSeed } from "@app/appState/appState.types";
import type { SiteConfig } from "@config/site.config.types";
import type { NavigationConfig } from "@config/navigation.config.types";
import type { SocialConfig } from "@config/social.config.types";
import type { StructuredDataConfig } from "@config/structured-data.config.types";
import type { AssetsConfig } from "@config/assets.config.types";
import type { FooterConfig } from "@config/footer.config.types";
import type { WebManifestConfig } from "@config/webmanifest.config.types";

export class AppState {
  constructor(private readonly seed: AppStateSeed) {}

  public getSiteConfig(): SiteConfig {
    return this.seed.site;
  }

  public getNavigationConfig(): NavigationConfig {
    return this.seed.navigation;
  }

  public getSocialConfig(): SocialConfig {
    return this.seed.social;
  }

  public getStructuredDataConfig(): StructuredDataConfig {
    return this.seed.structuredData;
  }

  public getAssetsConfig(): AssetsConfig {
    return this.seed.assets;
  }

  public getFooterConfig(): FooterConfig {
    return this.seed.footer;
  }

  public getWebManifestConfig(): WebManifestConfig {
    return this.seed.webmanifest;
  }

  public toJSON(): Record<string, unknown> {
    return this.seed;
  }
}
