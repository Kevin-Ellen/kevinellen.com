// src/pages/error/static/authored.500.error.page.ts

import type { AuthoredErrorPageDefinition } from "@shared-types/pages/definitions/error/authored.base.error.definition.page.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredInternalErrorPage: AuthoredErrorPageDefinition =
  deepFreeze({
    id: "error-500",
    status: 500,

    metadata: {
      pageTitle: "500 | Internal server error",
      metaDescription: "Something went wrong while trying to render this page.",
    },

    breadcrumbs: ["home", "error-500"],

    content: {
      head: {
        eyebrow: "500",
        title: "Internal server error",
        intro: "Something went wrong while trying to load this page.",
      },

      body: [
        {
          kind: "contentSection",
          heading: {
            text: "Internal server error",
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
                    "This is a server-side failure rather than a missing route. Please try again shortly.",
                },
              ],
            },
          ],
        },
      ],

      footer: ["Please return to the homepage or try again in a moment."],
    },
  });
