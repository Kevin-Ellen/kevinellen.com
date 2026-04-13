// shared-types/pages/definitions/public/about/technology/app-state.technology.about.public.definition.page.types.ts

import type { AuthoredTechnologyAboutPublicPage } from "@shared-types/pages/definitions/public/about/technology/authored.technology.about.public.definition.page.types";
import type { AppStatePublicBasePageDefinitionDeterministicFields } from "@shared-types/pages/definitions/public/base/app-state.base.public.definition.page.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppStateTechnologyAboutPublicPage = Replace<
  AuthoredTechnologyAboutPublicPage,
  AppStatePublicBasePageDefinitionDeterministicFields
>;
