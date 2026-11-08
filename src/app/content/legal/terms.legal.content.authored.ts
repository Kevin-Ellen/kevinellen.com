// src/app/content/legal/terms.legal.content.authored.ts

import type { PublicContentAuthored } from "../../../content-schema/content/public.content.content-schema.authored.type";

export const termsLegalContentAuthored = {
  kind: "public",
  render: "static",
  pageType: "standard",
  id: "terms",
  slug: "/legal/terms",
  label: "Terms of Use",
  breadcrumbs: ["home", "terms"],
  dates: {
    created: "2026-04-13",
    lastUpdated: "2026-10-26",
  },
  metadata: {
    title: "Terms of Use",
    description:
      "Terms of use for kevinellen.com, covering wildlife photography, field journals, copyright, permitted use and image licensing.",
    sitemap: true,
  },
  body: {
    modules: [
      {
        kind: "pageIntro",
        eyebrow: "Legal",
        title: "Terms of Use",
        description:
          "These terms explain how you may use this wildlife and nature photography website, including its photographs, field journals and other published material.",
      },
      {
        kind: "articleSection",
        heading: {
          id: "about-this-site",
          text: "About this site",
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
                        "This website is a personal photography portfolio operated by Kevin Ellen. It features wildlife and nature photography, field journals, and observations from the natural world.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "The photographs and written content are provided for personal viewing, appreciation and general information.",
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
          id: "acceptable-use",
          text: "Acceptable use",
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
                        "You agree to use this site in a lawful and respectful manner.",
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
                            "You must not attempt to gain unauthorised access to the site or its infrastructure.",
                        },
                      ],
                    },
                    {
                      content: [
                        {
                          kind: "text",
                          value:
                            "You must not interfere with the operation, security, or performance of the site.",
                        },
                      ],
                    },
                    {
                      content: [
                        {
                          kind: "text",
                          value:
                            "You must not use automated systems to scrape, extract, or republish content without permission.",
                        },
                      ],
                    },
                    {
                      content: [
                        {
                          kind: "text",
                          value:
                            "You must not use the site in any way that is unlawful, harmful, or abusive.",
                        },
                      ],
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
          id: "intellectual-property",
          text: "Intellectual property",
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
                        "Unless otherwise credited, the photographs, field journals, written content and original design published here belong to Kevin Ellen.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "You may view content for personal, non-commercial use only.",
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
                            "You may not copy, reproduce, distribute, adapt, or modify content from this site without permission.",
                        },
                      ],
                    },
                    {
                      content: [
                        {
                          kind: "text",
                          value:
                            "You may not use photographs or writing from this site in publications, promotional material, commercial work or other public-facing projects without permission.",
                        },
                      ],
                    },
                    {
                      content: [
                        {
                          kind: "text",
                          value:
                            "You may not remove or alter copyright or attribution notices.",
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
                      value: "For image usage and licensing, please see the ",
                    },
                    {
                      kind: "link",
                      link: {
                        kind: "internal",
                        pageId: "licensing",
                        label: "photo licensing page",
                      },
                    },
                    {
                      kind: "text",
                      value: ".",
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
          id: "accuracy-and-availability",
          text: "Accuracy and availability",
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
                        "Field observations and other information are shared in good faith. Although care is taken, observations, species identifications and other details may be incomplete or subject to correction.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "The site may be updated, changed, or taken offline at any time without notice.",
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
          id: "external-links",
          text: "External links",
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
                        "This site may contain links to external websites. These are provided for convenience. No responsibility is taken for the content, availability, or practices of external sites.",
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
          id: "limitation-of-liability",
          text: "Limitation of liability",
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
                        "To the fullest extent permitted by law, no liability is accepted for any loss arising from the use of this site, reliance on its content, or any temporary or permanent unavailability.",
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
          id: "changes-to-these-terms",
          text: "Changes to these terms",
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
                        "These terms may be updated from time to time. Continued use of the site after changes are made constitutes acceptance of the updated terms.",
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
          id: "contact",
          text: "Contact",
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
                        "If you have questions about these terms or would like to request permission to use content, you can contact me through ",
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
                      value: " or ",
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
                      value: ".",
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
