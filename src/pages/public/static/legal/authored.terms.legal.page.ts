// src/app/content/pages/public/legal/terms.public.page.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredTermsLegalPage: AuthoredPublicPageDefinition = deepFreeze({
  id: "terms",
  kind: "static",
  slug: "/legal/terms",
  label: "Terms of Use",

  metadata: {
    pageTitle: "Terms of Use | Kevin Ellen",
    metaDescription:
      "Terms of use for kevinellen.com, covering acceptable use, intellectual property, image protection, and site limitations.",
  },

  breadcrumbs: ["home", "terms"],

  content: {
    header: {
      eyebrow: "Legal",
      title: "Terms of Use",
      intro:
        "These terms govern the use of this website. By accessing or using the site, you agree to them. If you do not agree, please do not use the site.",
    },

    content: [
      {
        kind: "contentSection",
        heading: {
          text: "About this site",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "This website is a personal portfolio and publication platform operated by Kevin Ellen. It presents nature photography, written content, and technical material.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "The content is provided for general information and personal viewing.",
              },
            ],
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "Acceptable use",
          level: 2,
        },
        modules: [
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

      {
        kind: "contentSection",
        heading: {
          text: "Intellectual property",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "All content on this site, including photographs, text, and design, is the property of Kevin Ellen unless otherwise stated.",
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
                      "You may not use images or text from this site in any publication, commercial context, or public-facing work without permission.",
                  },
                ],
              },
              {
                content: [
                  {
                    kind: "text",
                    value:
                      "You may not use content from this site for training machine learning or AI systems.",
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
                kind: "internalLink",
                link: {
                  kind: "internal",
                  id: "licensing",
                  text: "photo licensing page",
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

      {
        kind: "contentSection",
        heading: {
          text: "Accuracy and availability",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "This site is provided as is. While care is taken to ensure accuracy, no guarantees are made that content is complete, accurate, or up to date.",
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

      {
        kind: "contentSection",
        heading: {
          text: "External links",
          level: 2,
        },
        modules: [
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

      {
        kind: "contentSection",
        heading: {
          text: "Limitation of liability",
          level: 2,
        },
        modules: [
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

      {
        kind: "contentSection",
        heading: {
          text: "Changes to these terms",
          level: 2,
        },
        modules: [
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
                  "If you have any questions about these terms or would like to request permission to use content, please get in touch via social media. Links to active profiles are available in the site footer.",
              },
            ],
          },
        ],
      },
    ],
  },
});
