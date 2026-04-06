// packages/shared-types/src/content/pages/public/public.page.definition.ts

import type { HomePageDefinition } from "@shared-types/content/pages/public/home/home.public.page.definition";
import type { JournalListingPageDefinition } from "@shared-types/content/pages/public/journal-listing/journal-listing.public.page.definition";
import type { AboutPageDefinition } from "@shared-types/content/pages/public/about/about.public.page.definition";
import type { EquipmentAboutPageDefinition } from "@shared-types/content/pages/public/about-equipment/equipment.about.public.page.definition";
import type { TechnologyAboutPageDefinition } from "@shared-types/content/pages/public/about-technology/technology.about.public.page.definition";
import type { LicensingLegalPageDefinition } from "@shared-types/content/pages/public/legal-licensing/licensing.legal.public.page.definition";
import type { PrivacyLegalPageDefinition } from "@shared-types/content/pages/public/legal-privacy/privacy.legal.public.page.definition";
import type { TermsLegalPageDefinition } from "@shared-types/content/pages/public/legal-terms/terms.legal.public.page.definition";

export type PublicPage =
  | HomePageDefinition
  | JournalListingPageDefinition
  | AboutPageDefinition
  | EquipmentAboutPageDefinition
  | TechnologyAboutPageDefinition
  | LicensingLegalPageDefinition
  | PrivacyLegalPageDefinition
  | TermsLegalPageDefinition;
