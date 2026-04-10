// src/app/content/pages/error/404.error.page.ts

import type { BaseErrorPageDefinition } from "@shared-types/content/pages/error/error.page.definition";
import type { ErrorPageContentAuthored } from "@shared-types/content/pages/error/error.page.content";

export const notFoundErrorPage: BaseErrorPageDefinition<ErrorPageContentAuthored> =
  {
    core: {
      id: "error-404",
      kind: "error",
      status: 404,
      label: "404",
    },

    config: {
      robots: {
        allowIndex: false,
        allowFollow: false,
        noarchive: true,
        nosnippet: true,
        noimageindex: true,
      },
    },

    meta: {
      pageTitle: "404 | Page not found",
      metaDescription: "The page you requested could not be found.",
    },

    breadcrumbs: ["home", "error-404"],

    content: {
      head: {
        eyebrow: "404",
        title: "Page not found",
        intro: "The page you were looking for does not appear to exist here.",
      },

      body: [
        {
          kind: "contentSection",
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

      footer: ["Please return to the homepage and continue from there."],
    },

    assets: {
      scripts: [],
      svgs: [],
    },
  };
