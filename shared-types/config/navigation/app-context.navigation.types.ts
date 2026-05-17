// shared-types/config/navigation/app-context.navigation.types.ts

import type { AppStateNavigation } from "@shared-types/config/navigation/app-state.navigation.types";

import type { AppContextHeaderNavigation } from "@shared-types/config/navigation/header/app-context.header.navigation.types";
import type { AppContextFooterNavigation } from "@shared-types/config/navigation/footer/app-context.footer.navigation.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextNavigationTypeFields = Readonly<{
  header: AppContextHeaderNavigation;
  footer: AppContextFooterNavigation;
}>;

export type AppContextNavigation = Replace<
  AppStateNavigation,
  AppContextNavigationTypeFields
>;
