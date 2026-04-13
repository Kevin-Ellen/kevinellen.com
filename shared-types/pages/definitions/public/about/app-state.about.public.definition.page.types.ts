// shared-types/pages/definitions/public/about/app-state.about.public.definition.page.types.ts

import type { AuthoredAboutPublicPage } from "@shared-types/pages/definitions/public/about/authored.about.public.definition.page.types";
import type { AppStatePublicBasePageDefinitionDeterministicFields } from "@shared-types/pages/definitions/public/base/app-state.base.public.definition.page.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppStateAboutPublicPage = Replace<
  AuthoredAboutPublicPage,
  AppStatePublicBasePageDefinitionDeterministicFields
>;
