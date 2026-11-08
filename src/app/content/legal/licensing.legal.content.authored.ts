// src/app/content/legal/licensing.legal.content.authored.ts

import type { PublicContentAuthored } from "../../../content-schema/content/public.content.content-schema.authored.type";

export const licensingLegalContentAuthored = {
  kind: "public",
  render: "static",
  pageType: "standard",
  id: "licensing",
  slug: "/legal/licensing",
  label: "Photo Licensing",
  breadcrumbs: ["home", "licensing"],
  dates: {
    created: "2026-04-13",
    lastUpdated: "2026-10-26",
  },
  metadata: {
    title: "Photo Licensing",
    description:
      "Photography licensing and permissions for wildlife and nature photographs by Kevin Ellen, including personal use, reproduction, attribution and commercial enquiries.",
    sitemap: true,
  },
  body: {
    modules: [
      {
        kind: "pageIntro",
        eyebrow: "Legal",
        title: "Photo Licensing",
        description:
          "Interested in using one of my wildlife or nature photographs? This page explains what you can do without permission, when a licence is needed, and how to make an enquiry.",
      },
      {
        kind: "articleSection",
        heading: {
          id: "copyright-and-ownership",
          text: "Copyright and ownership",
          level: 2,
        },
        entries: [
          {
            layout: "reading",
            module: {
              kind: "richContent",
              components: [
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "Unless otherwise credited, the photographs published on kevinellen.com are created and owned by Kevin Ellen and are protected by copyright.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "Copyright applies regardless of image size, resolution, format, cropping or presentation. Publishing a photograph online does not place it in the public domain or grant permission for others to reproduce it.",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        kind: "articleSection",
        heading: {
          id: "personal-use-and-sharing",
          text: "Personal use and sharing",
          level: 2,
        },
        entries: [
          {
            layout: "reading",
            module: {
              kind: "richContent",
              components: [
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "You are welcome to browse the website, enjoy the photographs and share links to the pages where they appear.",
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
                            "You may view photographs for personal, non-commercial enjoyment and reference.",
                        },
                      ],
                    },
                    {
                      content: [
                        {
                          kind: "text",
                          value:
                            "You may share links to photographs, journal entries and other pages on this website.",
                        },
                      ],
                    },
                    {
                      content: [
                        {
                          kind: "text",
                          value:
                            "You may reference or discuss my work, including linking to the original source.",
                        },
                      ],
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "These permissions do not include downloading and redistributing image files, reposting photographs elsewhere, or using them in your own publications or projects.",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        kind: "articleSection",
        heading: {
          id: "when-permission-is-required",
          text: "When permission is required",
          level: 2,
        },
        entries: [
          {
            layout: "reading",
            module: {
              kind: "richContent",
              components: [
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "Please request permission before reproducing, distributing or adapting any photograph from this website. Examples include:",
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
                            "Publishing a photograph in an article, book, magazine, newspaper or other editorial work.",
                        },
                      ],
                    },
                    {
                      content: [
                        {
                          kind: "text",
                          value:
                            "Using a photograph in advertising, promotional materials, products or commercial projects.",
                        },
                      ],
                    },
                    {
                      content: [
                        {
                          kind: "text",
                          value:
                            "Reposting or uploading an image to another website, social media account or third-party platform.",
                        },
                      ],
                    },
                    {
                      content: [
                        {
                          kind: "text",
                          value:
                            "Cropping, recolouring, manipulating or otherwise adapting a photograph for republication.",
                        },
                      ],
                    },
                    {
                      content: [
                        {
                          kind: "text",
                          value:
                            "Producing prints, merchandise or other physical reproductions.",
                        },
                      ],
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "Crediting the photographer or linking to the original image does not, by itself, grant permission to reproduce the work.",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        kind: "articleSection",
        heading: {
          id: "photography-licensing",
          text: "Photography licensing",
          level: 2,
        },
        entries: [
          {
            layout: "reading",
            module: {
              kind: "richContent",
              components: [
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "Selected photographs may be available for licensing for editorial, educational, conservation-related or commercial use.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "Each enquiry is considered individually. Availability, permitted use, image specifications, attribution requirements and any applicable licensing fee will depend on the project.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "Permission must be agreed before the photograph is used. A licence applies only to the uses and conditions agreed; copyright ownership is not transferred unless expressly stated.",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        kind: "articleSection",
        heading: {
          id: "attribution",
          text: "Attribution",
          level: 2,
        },
        entries: [
          {
            layout: "reading",
            module: {
              kind: "richContent",
              components: [
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "Where a licence is granted, photographs should be credited to Kevin Ellen unless different attribution arrangements have been agreed.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "The appropriate credit format and placement can be confirmed as part of the licensing agreement.",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        kind: "articleSection",
        heading: {
          id: "licensing-enquiries",
          text: "Licensing enquiries",
          level: 2,
        },
        entries: [
          {
            layout: "reading",
            module: {
              kind: "richContent",
              components: [
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "For photography licensing enquiries or permission requests, you can contact me through ",
                    },
                    {
                      kind: "link",
                      link: {
                        kind: "social",
                        profile: "twitter",
                        label: "X / Twitter",
                      },
                    },
                    {
                      kind: "text",
                      value: " or ",
                    },
                    {
                      kind: "link",
                      link: {
                        kind: "social",
                        profile: "linkedIn",
                        label: "LinkedIn",
                      },
                    },
                    {
                      kind: "text",
                      value: ".",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "It helps to include a link to the photograph, a brief description of your project, where and how the image would be used, and whether the intended use is commercial or non-commercial.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "Please also mention any publication deadlines or specific image requirements, such as resolution, dimensions or print size.",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
} as const satisfies PublicContentAuthored;
