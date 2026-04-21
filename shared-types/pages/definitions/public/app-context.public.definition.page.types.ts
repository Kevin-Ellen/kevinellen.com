// shared-types/pages/definitions/public/app-context.public.definition.page.types.ts

// Home
import type { AppContextHomePublicPage } from "@shared-types/pages/definitions/public/home/app-context.home.public.definition.page.types";

// Legal
import type { AppContextTermsLegalPublicPage } from "@shared-types/pages/definitions/public/legal/terms/app-context.terms.legal.public.definition.page.types";
import type { AppContextPrivacyLegalPublicPage } from "@shared-types/pages/definitions/public/legal/privacy/app-context.privacy.legal.public.definition.page.types";
import type { AppContextLicensingLegalPublicPage } from "@shared-types/pages/definitions/public/legal/licensing/app-context.licensing.legal.public.definition.page.types";

// About
import type { AppContextAboutPublicPage } from "@shared-types/pages/definitions/public/about/app-context.about.public.definition.page.types";
import type { AppContextTechnologyAboutPublicPage } from "@shared-types/pages/definitions/public/about/technology/app-context.technology.about.public.definition.page.types";
import type { AppContextEquipmentAboutPublicPage } from "@shared-types/pages/definitions/public/about/equipment/app-context.equipment.about.public.definition.page.types";

export type AppContextPublicPageDefinition =
  | AppContextHomePublicPage
  | AppContextTermsLegalPublicPage
  | AppContextPrivacyLegalPublicPage
  | AppContextLicensingLegalPublicPage
  | AppContextAboutPublicPage
  | AppContextTechnologyAboutPublicPage
  | AppContextEquipmentAboutPublicPage;
