// src/app-context/resolve/navigation/navigation.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppContextNavigation } from "@shared-types/config/navigation/app-context.navigation.types";
import type { AppStateNavigation } from "@shared-types/config/navigation/app-state.navigation.types";

import { resolveFooterNavigationAppContext } from "@app-context/resolve/navigation/footer.navigation.resolve.app-context";
import { resolveHeaderNavigationAppContext } from "@app-context/resolve/navigation/header.navigation.resolve.app-context";

export const resolveNavigationAppContext = (
  navigation: AppStateNavigation,
  appState: AppState,
): AppContextNavigation => {
  return {
    header: resolveHeaderNavigationAppContext(navigation.header, appState),
    footer: resolveFooterNavigationAppContext(navigation.footer, appState),
  };
};
