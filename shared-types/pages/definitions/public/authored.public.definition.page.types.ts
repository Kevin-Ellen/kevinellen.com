// shared-types/pages/definitions/public/authored.public.definition.page.types.ts
// Home
import type { AuthoredHomePublicPage } from "@shared-types/pages/definitions/public/home/authored.home.public.definition.page.types";

// Legal
import type { AuthoredTermsLegalPublicPage } from "@shared-types/pages/definitions/public/legal/terms/authored.terms.legal.public.definition.page.types";
import type { AuthoredPrivacyLegalPublicPage } from "@shared-types/pages/definitions/public/legal/privacy/authored.privacy.legal.public.definition.page.types";
import type { AuthoredLicensingLegalPublicPage } from "@shared-types/pages/definitions/public/legal/licensing/authored.licensing.legal.public.definition.page.types";

// About
import type { AuthoredAboutPublicPage } from "@shared-types/pages/definitions/public/about/authored.about.public.definition.page.types";
import type { AuthoredTechnologyAboutPublicPage } from "@shared-types/pages/definitions/public/about/technology/authored.technology.about.public.definition.page.types";
import type { AuthoredEquipmentAboutPublicPage } from "@shared-types/pages/definitions/public/about/equipment/authored.equipment.about.public.definition.page.types";

export type AuthoredPublicPageDefinition =
  | AuthoredHomePublicPage
  | AuthoredTermsLegalPublicPage
  | AuthoredPrivacyLegalPublicPage
  | AuthoredLicensingLegalPublicPage
  | AuthoredAboutPublicPage
  | AuthoredTechnologyAboutPublicPage
  | AuthoredEquipmentAboutPublicPage;
