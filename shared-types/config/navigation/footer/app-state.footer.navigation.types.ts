// shared-types/config/navigation/footer/app-state.footer.navigation.types.ts

import type {
  AuthoredFooterNavigation,
  AuthoredFooterNavigationSection,
} from "@shared-types/config/navigation/footer/authored.footer.navigation.types";
import type { AppStateLink } from "@shared-types/links/app-state.links.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateFooterNavigationSectionFields = Readonly<{
  items: readonly AppStateLink[];
}>;

export type AppStateFooterNavigationSection = Replace<
  AuthoredFooterNavigationSection,
  AppStateFooterNavigationSectionFields
>;

type AppStateFooterNavigationFields = Readonly<{
  sections: readonly AppStateFooterNavigationSection[];
}>;

export type AppStateFooterNavigation = Replace<
  AuthoredFooterNavigation,
  AppStateFooterNavigationFields
>;
