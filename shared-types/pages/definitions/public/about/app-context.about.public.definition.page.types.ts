// shared-types/pages/definitions/public/about/app-context.about.public.definition.page.types.ts

import type { AuthoredAboutPublicPage } from "@shared-types/pages/definitions/public/about/authored.about.public.definition.page.types";
import type { AppContextPublicBasePageDefinition } from "@shared-types/pages/definitions/public/base/app-context.base.public.definition.page.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextAboutPublicPage = Replace<
  AuthoredAboutPublicPage,
  AppContextPublicBasePageDefinition
>;
