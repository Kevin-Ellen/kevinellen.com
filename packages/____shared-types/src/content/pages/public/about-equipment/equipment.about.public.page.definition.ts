// packages/shared-types/src/content/pages/public/about-equipment/equipment.about.public.page.definition.ts

import type {
  BasePublicPageDefinitionCore,
  PublicPageDefinition,
} from "@shared-types/content/pages/public/base.public.page.definition";
import type { EquipmentAboutPageContentAuthored } from "@shared-types/content/pages/public/about-equipment/equipment.about.public.page.content";

export type EquipmentAboutPageDefinitionCore = BasePublicPageDefinitionCore & {
  kind: "longForm";
};

export type EquipmentAboutPageDefinition = PublicPageDefinition<
  EquipmentAboutPageDefinitionCore,
  EquipmentAboutPageContentAuthored
>;
