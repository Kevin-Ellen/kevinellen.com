// src/app-context/resolve/navigation/header.navigation.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppContextHeaderNavigation } from "@shared-types/config/navigation/header/app-context.header.navigation.types";
import type { AppStateHeaderNavigation } from "@shared-types/config/navigation/header/app-state.header.navigation.types";

import { resolveLinkAppContext } from "@app-context/resolve/shared/links/link.shared.resolve.app-context";

export const resolveHeaderNavigationAppContext = (
  navigation: AppStateHeaderNavigation,
  appState: AppState,
): AppContextHeaderNavigation => {
  return {
    primary: navigation.primary.map((link) =>
      resolveLinkAppContext(link, appState),
    ),
    social: navigation.social.map((link) =>
      resolveLinkAppContext(link, appState),
    ),
  };
};
