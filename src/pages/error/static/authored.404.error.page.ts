// src/pages/error/static/authored.404.error.page.ts

import type { AuthoredErrorPageDefinition } from "@shared-types/page-definitions/authored.error.page-definition.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredNotFoundErrorPage: AuthoredErrorPageDefinition =
  deepFreeze({
    id: "error-404",
    status: 404,
    label: "404 | Page not found",

    metadata: {
      pageTitle: "404 | Page not found",
      metaDescription: "The page you requested could not be found.",
    },

    content: {
      header: {
        eyebrow: "404",
        title: "Page not found",
        intro: "The page you were looking for does not appear to exist here.",
      },

      content: [
        {
          kind: "articleSection",
          heading: {
            text: "Page not found",
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
                    "The address may be incorrect, the page may have moved, or the link may be out of date.",
                },
              ],
            },
          ],
        },
      ],
    },
  });
