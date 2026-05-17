// src/app-context/resolve/shell/navigation/navigation.resolve.app-context.ts

import type { AppState } from "@app-state/class.app-state";
import type { AppContextNavigation } from "@shared-types/config/navigation/app-context.navigation.types";
import type { AppStateNavigation } from "@shared-types/config/navigation/app-state.navigation.types";

import { appContextResolveHeaderNavigation } from "@app-context/resolve/shell/navigation/header.navigation.resolve.app-context";
import { appContextResolveFooterNavigation } from "@app-context/resolve/shell/navigation/footer.navigation.resolve.app-context";

export const appContextResolveNavigation = (
  navigation: AppStateNavigation,
  appState: AppState,
): AppContextNavigation => {
  return {
    header: appContextResolveHeaderNavigation(navigation.header, appState),
    footer: appContextResolveFooterNavigation(navigation.footer, appState),
  };
};
