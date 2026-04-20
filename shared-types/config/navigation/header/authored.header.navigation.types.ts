// shared-types/config/navigation/header/authored.header.navigation.types.ts

import type { AuthoredNavigationItem } from "@shared-types/config/navigation/authored.shared.navigation.types";

export type AuthoredHeaderNavigation = Readonly<{
  primary: readonly AuthoredNavigationItem[];
  social: readonly AuthoredNavigationItem[];
}>;
