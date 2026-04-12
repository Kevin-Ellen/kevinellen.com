// shared-types/config/navigation/authored.shared.navigation.types.ts

import type { AuthoredLink } from "@shared-types/links/authored.links.types";

export type AuthoredNavigationItem = AuthoredLink;

export type AuthoredNavigationSectionId = string;

export type AuthoredNavigationSection = {
  id: AuthoredNavigationSectionId;
  label: string;
  items: readonly AuthoredNavigationItem[];
};
