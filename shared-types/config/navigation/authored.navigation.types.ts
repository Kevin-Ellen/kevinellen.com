// shared-types/config/navigation/authored.navigation.types.ts

import type { AuthoredHeaderNavigation } from "@shared-types/config/navigation/header/authored.header.navigation.types";
import type { AuthoredFooterNavigation } from "@shared-types/config/navigation/footer/authored.footer.navigation.types";

export type AuthoredNavigation = Readonly<{
  header: AuthoredHeaderNavigation;
  footer: AuthoredFooterNavigation;
}>;
