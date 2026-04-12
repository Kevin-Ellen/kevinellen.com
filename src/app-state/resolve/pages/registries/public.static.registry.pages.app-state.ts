// src/app-state/resolve/pages/registries/public.static.registry.pages.app-state.ts

import { AuthoredPublicPageDefintion } from "@shared-types/pages/definitions/public/authored.public.definition.page.types";

import { authoredHomePublicPage } from "@pages/public/static/authored.home.public.page";

// Legal
import { authoredLicensingLegalPage } from "@pages/public/static/legal/authored.licensing.legal.page";
import { authoredTermsLegalPage } from "@pages/public/static/legal/authored.terms.legal.page";
import { authoredPrivacyLegalPage } from "@pages/public/static/legal/authored.privacy.legal.page";

export const APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC: readonly AuthoredPublicPageDefintion[] =
  [
    authoredHomePublicPage,
    authoredLicensingLegalPage,
    authoredTermsLegalPage,
    authoredPrivacyLegalPage,
  ] as const;
