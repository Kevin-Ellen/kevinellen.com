// shared-types/pages/definitions/public/home/app-context.home.public.definition.page.types.ts

import type { AuthoredHomePublicPage } from "@shared-types/pages/definitions/public/home/authored.home.public.definition.page.types";
import type { AppContextPublicBasePageDefinition } from "@shared-types/pages/definitions/public/base/app-context.base.public.definition.page.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

export type AppContextHomePublicPage = Replace<
  AuthoredHomePublicPage,
  AppContextPublicBasePageDefinition
>;
