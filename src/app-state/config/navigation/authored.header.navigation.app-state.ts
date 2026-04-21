// src/app-state/config/navigation/authored.header.navigation.app-state.ts

import type { AuthoredHeaderNavigation } from "@shared-types/config/navigation/header/authored.header.navigation.types";
import type { PageIdPublic } from "@shared-types/pages/shared/id.shared.page.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredHeaderNavigation: AuthoredHeaderNavigation = deepFreeze({
  primary: [{ kind: "internal", id: "about" as PageIdPublic }],
  social: [
    {
      kind: "social",
      id: "github",
      svgId: "icon-github",
    },
    {
      kind: "social",
      id: "instagram",
      svgId: "icon-instagram",
    },
  ],
});
