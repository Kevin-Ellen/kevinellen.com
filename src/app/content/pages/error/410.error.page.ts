// src/app/content/pages/error/410.error.page.ts

import type { BaseErrorPageDefinition } from "@shared-types/content/pages/error/error.page.definition";
import type { ErrorPageContentAuthored } from "@shared-types/content/pages/error/error.page.content";

export const goneErrorPage: BaseErrorPageDefinition<ErrorPageContentAuthored> =
  {
    core: {
      id: "error-410",
      kind: "error",
      status: 410,
      label: "410",
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

      footer: ["Please return to the homepage to continue browsing."],
    },

    assets: {
      scripts: [],
      svgs: [],
    },
  };
