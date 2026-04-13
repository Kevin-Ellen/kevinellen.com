// shared-types/pages/definitions/public/about/equipment/app-state.equipment.about.public.definition.page.types.ts

import type { AuthoredEquipmentAboutPublicPage } from "@shared-types/pages/definitions/public/about/equipment/authored.equipment.about.public.definition.page.types";
import type { AppStatePublicBasePageDefinitionDeterministicFields } from "@shared-types/pages/definitions/public/base/app-state.base.public.definition.page.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppStateEquipmentAboutPublicPage = Replace<
  AuthoredEquipmentAboutPublicPage,
  AppStatePublicBasePageDefinitionDeterministicFields
>;
