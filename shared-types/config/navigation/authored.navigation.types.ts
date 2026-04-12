// shared-types/config/navigation/authored.navigation.types.ts

import type { AuthoredHeaderNavigation } from "@shared-types/config/navigation/authored.header.navigation.types";
import type { AuthoredFooterNavigation } from "@shared-types/config/navigation/authored.footer.navigation.types";

export type AuthoredNavigation = {
  header: AuthoredHeaderNavigation;
  footer: AuthoredFooterNavigation;
};
