// shared-types/config/navigation/header/app-context.header.navigation.types.ts

import type { AuthoredHeaderNavigation } from "@shared-types/config/navigation/header/authored.header.navigation.types";
import type { AppContextLink } from "@shared-types/links/app-context.links.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextHeaderNavigationFields = Readonly<{
  primary: readonly AppContextLink[];
  social: readonly AppContextLink[];
}>;

export type AppContextHeaderNavigation = Replace<
  AuthoredHeaderNavigation,
  AppContextHeaderNavigationFields
>;
