// src/app-context/resolve/navigation/footer.navigation.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppContextFooterNavigation } from "@shared-types/config/navigation/footer/app-context.footer.navigation.types";
import type { AppStateFooterNavigation } from "@shared-types/config/navigation/footer/app-state.footer.navigation.types";

import { resolveLinkAppContext } from "@app-context/resolve/shared/links/link.shared.resolve.app-context";

export const resolveFooterNavigationAppContext = (
  navigation: AppStateFooterNavigation,
  appState: AppState,
): AppContextFooterNavigation => {
  return {
    sections: navigation.sections.map((section) => ({
      ...section,
      items: section.items.map((link) => resolveLinkAppContext(link, appState)),
    })),
  };
};
