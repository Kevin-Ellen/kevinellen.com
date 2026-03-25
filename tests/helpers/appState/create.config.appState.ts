// tests/helpers/appState/create.config.appState.ts

import type { AppStateConfig } from "@app/appState/appState.types";
import type {
  ErrorPageDefinition,
  PageDefinition,
} from "@app/pages/page.definition";

import { siteConfig } from "@config/site.config";
import { assetsConfig } from "@config/assets.config";
import { footerConfig } from "@config/footer.config";
import { navigationConfig } from "@config/navigation.config";
import { socialConfig } from "@config/social.config";
import { structuredDataConfig } from "@config/structured-data.config";
import { webManifestConfig } from "@config/webmanifest.config";
import { REDIRECTS } from "@config/redirects.config";
import { GONE_RULES } from "@config/gone.config";

export const createAppStateConfig = ({
  publicPages,
  errorPages,
}: {
  publicPages: readonly PageDefinition[];
  errorPages: readonly ErrorPageDefinition[];
}): AppStateConfig => ({
  siteConfig,
  assetsConfig,
  footerConfig,
  navigationConfig,
  socialConfig,
  structuredDataConfig,
  webManifestConfig,
  redirectsConfig: REDIRECTS,
  goneConfig: GONE_RULES,
  pages: {
    publicPages,
    errorPages,
  },
});
