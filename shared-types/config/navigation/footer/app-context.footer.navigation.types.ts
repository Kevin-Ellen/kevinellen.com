// shared-types/config/navigation/footer/app-context.footer.navigation.types.ts

import type {
  AuthoredFooterNavigation,
  AuthoredFooterNavigationSection,
} from "@shared-types/config/navigation/footer/authored.footer.navigation.types";
import type { AppContextLink } from "@shared-types/links/app-context.links.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextFooterNavigationSectionFields = Readonly<{
  items: readonly AppContextLink[];
}>;

export type AppContextFooterNavigationSection = Replace<
  AuthoredFooterNavigationSection,
  AppContextFooterNavigationSectionFields
>;

type AppContextFooterNavigationFields = Readonly<{
  sections: readonly AppContextFooterNavigationSection[];
}>;

export type AppContextFooterNavigation = Replace<
  AuthoredFooterNavigation,
  AppContextFooterNavigationFields
>;
