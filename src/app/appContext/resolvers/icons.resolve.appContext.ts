// src/app/appContext/resolvers/icons.resolve.appContext.ts

import type { AppState } from "@app/appState/class.appState";
import type { AppContextHeadIcons } from "@app/appContext/appContext.types";

export const resolveIconsAppContext = (
  appState: AppState,
): AppContextHeadIcons => {
  return appState.site.icons;
};
