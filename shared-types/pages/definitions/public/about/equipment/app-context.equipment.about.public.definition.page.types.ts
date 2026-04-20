// shared-types/pages/definitions/public/about/equipment/app-context.equipment.about.public.definition.page.types.ts

import type { AppContextPublicBasePageDefinition } from "@shared-types/pages/definitions/public/base/app-context.base.public.definition.page.types";
import type { AuthoredEquipmentAboutPublicPage } from "@shared-types/pages/definitions/public/about/equipment/authored.equipment.about.public.definition.page.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextEquipmentAboutPublicPage = Replace<
  AuthoredEquipmentAboutPublicPage,
  AppContextPublicBasePageDefinition
>;
