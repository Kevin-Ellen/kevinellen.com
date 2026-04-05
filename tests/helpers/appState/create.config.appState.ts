// tests/helpers/appState/create.config.appState.ts

import type { AppStateConfig } from "@app/appState/appState.types";
import type { ErrorPageDefinition } from "@shared-types/pages/definitions/error.definition.page";
import type { PublicPageDefinition } from "@shared-types/pages/definitions/public.definition.page";

import type { RedirectRule } from "@config/redirects.config.types";
import type { GoneRule } from "@config/gone.config.types";

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
  redirectsConfig = REDIRECTS,
  goneConfig = GONE_RULES,
}: {
  publicPages: readonly PublicPageDefinition[];
  errorPages: readonly ErrorPageDefinition[];
  redirectsConfig?: readonly RedirectRule[];
  goneConfig?: readonly GoneRule[];
}): AppStateConfig => ({
  siteConfig,
  assetsConfig,
  footerConfig,
  navigationConfig,
  socialConfig,
  structuredDataConfig,
  webManifestConfig,
  redirectsConfig,
  goneConfig,
  pages: {
    publicPages,
    errorPages,
  },
});
