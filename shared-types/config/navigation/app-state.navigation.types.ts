// shared-types/config/navigation/app-state.navigation.types.ts

import type { AuthoredNavigation } from "@shared-types/config/navigation/authored.navigation.types";

import type { AppStateHeaderNavigation } from "@shared-types/config/navigation/header/app-state.header.navigation.types";
import type { AppStateFooterNavigation } from "@shared-types/config/navigation/footer/app-state.footer.navigation.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateNavigationTypeFields = Readonly<{
  header: AppStateHeaderNavigation;
  footer: AppStateFooterNavigation;
}>;

export type AppStateNavigation = Replace<
  AuthoredNavigation,
  AppStateNavigationTypeFields
>;
