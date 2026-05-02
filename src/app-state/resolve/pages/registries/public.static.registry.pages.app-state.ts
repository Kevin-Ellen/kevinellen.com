// src/app-state/resolve/pages/registries/public.static.registry.pages.app-state.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

import { authoredHomePublicPage } from "@pages/public/static/authored.home.public.page";

// Legal
import { authoredLicensingLegalPage } from "@pages/public/static/legal/authored.licensing.legal.page";
import { authoredTermsLegalPage } from "@pages/public/static/legal/authored.terms.legal.page";
import { authoredPrivacyLegalPage } from "@pages/public/static/legal/authored.privacy.legal.page";

// About
import { authoredAboutPage } from "@pages/public/static/about/authored.about.public.page";
import { authoredEquipmentAboutPage } from "@pages/public/static/about/authored.equipment.about.page";
import { authoredTechnologyAboutPage } from "@pages/public/static/about/authored.technology.about.page";

// Journal
import { authoredJournalPublicPage } from "@pages/public/static/authored.journal.public.page";

export const APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC: readonly AuthoredPublicPageDefinition[] =
  [
    authoredHomePublicPage,
    authoredLicensingLegalPage,
    authoredTermsLegalPage,
    authoredPrivacyLegalPage,
    authoredAboutPage,
    authoredEquipmentAboutPage,
    authoredTechnologyAboutPage,
    authoredJournalPublicPage,
  ] as const;
