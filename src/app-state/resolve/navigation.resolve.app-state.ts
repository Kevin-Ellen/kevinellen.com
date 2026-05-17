// src/app-state/resolve/navigation.resolve.app-state.ts

import type { AppStateNavigation } from "@shared-types/config/navigation/app-state.navigation.types";

import { authoredHeaderNavigation } from "@app-state/config/navigation/authored.header.navigation.app-state";
import { authoredFooterNavigation } from "@app-state/config/navigation/authored.footer.navigation.app-state";
import { resolveLinkAppState } from "@app-state/resolve/links/link.resolve.app-state";
import { deepFreeze } from "@utils/deepFreeze.util";

export const appStateResolveNavigation: AppStateNavigation = deepFreeze({
  header: {
    primary: authoredHeaderNavigation.primary.map(resolveLinkAppState),
    social: authoredHeaderNavigation.social.map(resolveLinkAppState),
  },
  footer: {
    sections: authoredFooterNavigation.sections.map((section) => ({
      ...section,
      items: section.items.map(resolveLinkAppState),
    })),
  },
});
