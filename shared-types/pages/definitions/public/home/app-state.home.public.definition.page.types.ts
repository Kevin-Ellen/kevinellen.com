// shared-types/pages/definitions/public/home/app-state.home.public.definition.page.types.ts

import type { AuthoredHomePublicPage } from "@shared-types/pages/definitions/public/home/authored.home.public.definition.page.types";
import type { AppStatePublicBasePageDefinitionDeterministicFields } from "@shared-types/pages/definitions/public/base/app-state.base.public.definition.page.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppStateHomePublicPage = Replace<
  AuthoredHomePublicPage,
  AppStatePublicBasePageDefinitionDeterministicFields
>;
