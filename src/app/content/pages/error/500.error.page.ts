// src/app/content/pages/error/500.error.page.ts

import type { BaseErrorPageDefinition } from "@shared-types/content/pages/error/error.page.definition";
import type { ErrorPageContentAuthored } from "@shared-types/content/pages/error/error.page.content";

export const internalErrorPage: BaseErrorPageDefinition<ErrorPageContentAuthored> =
  {
    core: {
      id: "error-500",
      kind: "error",
      status: 500,
      label: "500",
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
          kind: "paragraph",
          inlines: [
            {
              kind: "text",
              text: "This is a server-side failure rather than a missing route. Please try again shortly.",
            },
          ],
        },
      ],

      footer: ["Please return to the homepage or try again in a moment."],
    },

    assets: {
      scripts: [],
      svgs: [],
    },
  };
