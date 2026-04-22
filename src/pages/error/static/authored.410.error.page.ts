// src/pages/error/static/authored.410.error.page.ts

import type { AuthoredErrorPageDefinition } from "@shared-types/page-definitions/authored.error.page-definition.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredGoneErrorPage: AuthoredErrorPageDefinition = deepFreeze({
  id: "error-410",
  status: 410,
  label: "410 | Gone",

  metadata: {
    pageTitle: "410 | Gone",
    metaDescription: "The page you requested has been permanently removed.",
  },

  breadcrumbs: ["home", "error-410"],

  content: {
    head: {
      eyebrow: "410",
      title: "Gone",
      intro:
        "This page has been permanently removed and is no longer available.",
    },

    body: [
      {
        kind: "contentSection",
        heading: {
          text: "Gone",
          visuallyHidden: true,
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Unlike a missing page, this route has been intentionally retired and should not return.",
              },
            ],
          },
        ],
      },
    ],
  },
});
