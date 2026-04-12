// src/app-state/config/navigation/authored.header.navigation.app-state.ts

import type { AppStateNavigation } from "@shared-types/config/navigation/app-state.navigation.types";
import type { PageId } from "@shared-types/pages/shared/id.shared.page.types";
import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredHeaderNavigation: AppStateNavigation["header"] =
  deepFreeze({
    primary: [
      { kind: "internal", id: "journal" as PageId },
      { kind: "internal", id: "about" as PageId },
    ],
    social: [
      {
        kind: "social",
        id: "github",
        svgId: "icon-github",
        behaviour: {
          openInNewTab: true,
        },
      },
      {
        kind: "social",
        id: "instagram",
        svgId: "icon-instagram",
        behaviour: {
          openInNewTab: true,
        },
      },
    ],
  });
