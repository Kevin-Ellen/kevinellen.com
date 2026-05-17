// shared-types/config/navigation/footer/app-render-context.footer.navigation.types.ts

import type {
  AuthoredFooterNavigation,
  AuthoredFooterNavigationSection,
} from "@shared-types/config/navigation/footer/authored.footer.navigation.types";
import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextFooterNavigationSectionFields = Readonly<{
  items: readonly AppRenderContextLink[];
}>;

export type AppRenderContextFooterNavigationSection = Replace<
  AuthoredFooterNavigationSection,
  AppRenderContextFooterNavigationSectionFields
>;

type AppRenderContextFooterNavigationFields = Readonly<{
  sections: readonly AppRenderContextFooterNavigationSection[];
}>;

export type AppRenderContextFooterNavigation = Replace<
  AuthoredFooterNavigation,
  AppRenderContextFooterNavigationFields
>;
