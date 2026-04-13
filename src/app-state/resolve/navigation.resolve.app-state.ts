// src/app-state/resolve/navigation.resolve.app-state.ts

import type { AppStateNavigation } from "@shared-types/config/navigation/app-state.navigation.types";

import { authoredHeaderNavigation } from "@app-state/config/navigation/authored.header.navigation.app-state";
import { authoredFooterNavigation } from "@app-state/config/navigation/authored.footer.navigation.app-state";
import { deepFreeze } from "@utils/deepFreeze.util";

export const appStateResolveNavigation: AppStateNavigation = deepFreeze({
  header: authoredHeaderNavigation,
  footer: authoredFooterNavigation,
});
