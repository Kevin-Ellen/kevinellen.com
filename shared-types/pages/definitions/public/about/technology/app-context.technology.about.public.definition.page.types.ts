// shared-types/pages/definitions/public/about/technology/app-context.technology.about.public.definition.page.types.ts

import type { AuthoredTechnologyAboutPublicPage } from "@shared-types/pages/definitions/public/about/technology/authored.technology.about.public.definition.page.types";
import type { AppContextPublicBasePageDefinition } from "@shared-types/pages/definitions/public/base/app-context.base.public.definition.page.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextTechnologyAboutPublicPage = Replace<
  AuthoredTechnologyAboutPublicPage,
  AppContextPublicBasePageDefinition
>;
