// src/app/content/pages/public/legal/licensing.public.page.ts

import type { LicensingLegalPageDefinition } from "@shared-types/content/pages/public/legal-licensing/licensing.legal.public.page.definition";

export const licensingLegalPage: LicensingLegalPageDefinition = {
  core: {
    id: "licensing",
    kind: "longForm",
    slug: "/legal/licensing",
    label: "Photo Licensing",
  },

  config: {
    robots: {
      allowIndex: true,
      allowFollow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    },
    robotsTxt: {
      disallow: false,
    },
    sitemap: {
      include: true,
    },
  },

  meta: {
    pageTitle: "Photo Licensing | Kevin Ellen",
    metaDescription:
      "Photo licensing and usage terms for images published on kevinellen.com.",
  },

  breadcrumbs: ["home", "licensing"],

  content: {
    head: {
      eyebrow: "Legal",
      title: "Photo Licensing",
      intro:
        "All photographs on this site are protected by copyright. This page outlines how they may and may not be used.",
    },

    body: [
      {
        kind: "contentSection",
        heading: {
          text: "Ownership",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "All photographs published on this website are the property of Kevin Ellen unless explicitly stated otherwise.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Copyright applies to all images regardless of format, resolution, cropping, or presentation.",
              },
            ],
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "Personal use",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Images may be viewed for personal, non-commercial purposes only.",
              },
            ],
          },
          {
            kind: "list",
            items: [
              {
                content: [
                  {
                    kind: "text",
                    value:
                      "You may browse this site and view images for personal reference.",
                  },
                ],
              },
              {
                content: [
                  {
                    kind: "text",
                    value:
                      "You may share links to pages on this site where the images are hosted.",
                  },
                ],
              },
              {
                content: [
                  {
                    kind: "text",
                    value:
                      "You may not download, copy, store, or redistribute images without prior permission.",
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "Prohibited use",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Unless explicit permission has been granted in advance, the following uses are not allowed:",
              },
            ],
          },
          {
            kind: "list",
            items: [
              {
                content: [
                  {
                    kind: "text",
                    value:
                      "Use in any publication, article, marketing material, or other public-facing work.",
                  },
                ],
              },
              {
                content: [
                  {
                    kind: "text",
                    value:
                      "Commercial use of any kind, whether direct or indirect.",
                  },
                ],
              },
              {
                content: [
                  {
                    kind: "text",
                    value:
                      "Reposting on social media, websites, forums, or third-party platforms.",
                  },
                ],
              },
              {
                content: [
                  {
                    kind: "text",
                    value:
                      "Editing, manipulation, recolouring, cropping, or creation of derivative works.",
                  },
                ],
              },
              {
                content: [
                  {
                    kind: "text",
                    value:
                      "Use for training, developing, testing, or evaluating machine learning or artificial intelligence systems.",
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "Licensing",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Licensing may be available for selected images depending on the intended use.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "This may include editorial, commercial, or other agreed forms of publication.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Permission is considered on a case-by-case basis and must be agreed before any use takes place.",
              },
            ],
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "Attribution",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Where permission is granted, appropriate credit must be given unless explicitly agreed otherwise as part of the licence.",
              },
            ],
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "Contact",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "For licensing enquiries or permission requests, please get in touch via social media. Links to active profiles are available in the site footer.",
              },
            ],
          },
        ],
      },
    ],

    footer: [],
  },

  assets: {
    scripts: [],
    svgs: [],
  },

  structuredData: [],
};
