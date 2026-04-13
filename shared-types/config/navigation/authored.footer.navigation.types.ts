// shared-types/config/navigation/authored.footer.navigation.types.ts

import type { FooterNavigationId } from "@shared-types/config/navigation/id.footer.navigation.types";
import type { AuthoredLink } from "@shared-types/links/authored.links.types";

export type AuthoredFooterNavigationSection = Readonly<{
  id: FooterNavigationId;
  label: string;
  items: readonly AuthoredLink[];
}>;

export type AuthoredFooterNavigation = Readonly<{
  sections: readonly AuthoredFooterNavigationSection[];
}>;
