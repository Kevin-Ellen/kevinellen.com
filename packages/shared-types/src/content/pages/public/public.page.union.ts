// packages/shared-types/src/content/pages/public/public.page.definition.ts

import type { HomePageDefinition } from "@shared-types/content/pages/public/home/home.public.page.definition";
import type { JournalListingPageDefinition } from "@shared-types/content/pages/public/journal-listing/journal-listing.public.page.definition";
import type { AboutPageDefinition } from "@shared-types/content/pages/public/about/about.public.page.definition";
import type { EquipmentAboutPageDefinition } from "./about-equipment/equipment.about.public.page.definition";
import type { TechnologyAboutPageDefinition } from "./about-technology/technology.about.public.page.definition";

export type PublicPage =
  | HomePageDefinition
  | JournalListingPageDefinition
  | AboutPageDefinition
  | EquipmentAboutPageDefinition
  | TechnologyAboutPageDefinition;
