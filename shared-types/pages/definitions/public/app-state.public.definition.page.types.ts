// shared-types/pages/definitions/public/app-state.public.definition.page.types.ts

// Home
import type { AppStateHomePublicPage } from "@shared-types/pages/definitions/public/home/app-state.home.public.definition.page.types";

// About
import type { AppStateAboutPublicPage } from "@shared-types/pages/definitions/public/about/app-state.about.public.definition.page.types";
import type { AppStateEquipmentAboutPublicPage } from "@shared-types/pages/definitions/public/about/equipment/app-state.equipment.about.public.definition.page.types";
import type { AppStateTechnologyAboutPublicPage } from "@shared-types/pages/definitions/public/about/technology/app-state.technology.about.public.definition.page.types";

// Legal
import type { AppStateTermsLegalPublicPage } from "@shared-types/pages/definitions/public/legal/terms/app-state.terms.legal.public.definition.page.types";
import type { AppStatePrivacyLegalPublicPage } from "@shared-types/pages/definitions/public/legal/privacy/app-state.privacy.legal.public.definition.page.types";
import type { AppStateLicensingLegalPublicPage } from "@shared-types/pages/definitions/public/legal/licensing/app-state.licensing.legal.public.definition.page.types";

export type AppStatePublicPageDefinition =
  | AppStateHomePublicPage
  | AppStateAboutPublicPage
  | AppStateEquipmentAboutPublicPage
  | AppStateTechnologyAboutPublicPage
  | AppStateTermsLegalPublicPage
  | AppStatePrivacyLegalPublicPage
  | AppStateLicensingLegalPublicPage;
