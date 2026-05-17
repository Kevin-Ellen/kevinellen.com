// src/app-state/resolve/pages/registries/public.static.registry.pages.app-state.test.ts

import { APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC } from "@app-state/resolve/pages/registries/public.static.registry.pages.app-state";

import { authoredHomePublicPage } from "@pages/public/static/authored.home.public.page";

import { authoredLicensingLegalPage } from "@pages/public/static/legal/authored.licensing.legal.page";
import { authoredTermsLegalPage } from "@pages/public/static/legal/authored.terms.legal.page";
import { authoredPrivacyLegalPage } from "@pages/public/static/legal/authored.privacy.legal.page";

import { authoredAboutPage } from "@pages/public/static/about/authored.about.public.page";
import { authoredEquipmentAboutPage } from "@pages/public/static/about/authored.equipment.about.page";
import { authoredTechnologyAboutPage } from "@pages/public/static/about/authored.technology.about.page";

import { authoredJournalPublicPage } from "@pages/public/static/authored.journal.public.page";

import { authoredNotesPublicPage } from "@pages/public/static/authored.notes.public.page";

describe("APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC", () => {
  it("contains the static authored public pages", () => {
    expect(APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC).toEqual([
      authoredHomePublicPage,
      authoredLicensingLegalPage,
      authoredTermsLegalPage,
      authoredPrivacyLegalPage,
      authoredAboutPage,
      authoredEquipmentAboutPage,
      authoredTechnologyAboutPage,
      authoredJournalPublicPage,
      authoredNotesPublicPage,
    ]);
  });

  it("uses unique public page ids", () => {
    const ids = APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC.map((page) => page.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses unique public page slugs", () => {
    const slugs = APP_STATE_PAGE_REGISTRY_STATIC_PUBLIC.map(
      (page) => page.slug,
    );

    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
