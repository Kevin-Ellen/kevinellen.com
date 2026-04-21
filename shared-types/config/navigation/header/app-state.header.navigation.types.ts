// shared-types/config/navigation/header/app-state.header.navigation.types.ts

import type { AuthoredHeaderNavigation } from "@shared-types/config/navigation/header/authored.header.navigation.types";
import type { AppStateLink } from "@shared-types/links/app-state.links.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateHeaderNavigationFields = Readonly<{
  primary: readonly AppStateLink[];
  social: readonly AppStateLink[];
}>;

export type AppStateHeaderNavigation = Replace<
  AuthoredHeaderNavigation,
  AppStateHeaderNavigationFields
>;
