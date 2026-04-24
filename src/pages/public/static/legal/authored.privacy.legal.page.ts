// src/app/content/pages/public/legal/privacy.public.page.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredPrivacyLegalPage: AuthoredPublicPageDefinition =
  deepFreeze({
    id: "privacy",
    kind: "static",
    slug: "/legal/privacy",
    label: "Privacy",

    metadata: {
      pageTitle: "Privacy | Kevin Ellen",
      metaDescription:
        "Privacy information for kevinellen.com, including what data may be processed, why it is used, and how to get in touch about it.",
    },

    breadcrumbs: ["home", "privacy"],

    content: {
      header: {
        eyebrow: "Legal",
        title: "Privacy",
        intro:
          "This page explains what personal data may be processed when you use this website, why it may be processed, and what rights you have in relation to it.",
      },

      content: [
        {
          kind: "contentSection",
          heading: {
            text: "Approach",
            level: 2,
          },
          modules: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "This website is intended to be simple and respectful. It is not built around advertising, profiling, or invasive tracking.",
                },
              ],
            },
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "No cookies are used for analytics, advertising, or personalisation on this site.",
                },
              ],
            },
          ],
        },

        {
          kind: "contentSection",
          heading: {
            text: "What data may be processed",
            level: 2,
          },
          modules: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "When you visit this website, limited technical data may be processed in order to deliver and protect the site. This can include information such as your IP address, browser or device information, request details, and basic server or network activity.",
                },
              ],
            },
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "If you contact Kevin Ellen through social media or another platform linked from this site, any personal data you provide through that service will also be processed by that platform under its own privacy terms.",
                },
              ],
            },
          ],
        },

        {
          kind: "contentSection",
          heading: {
            text: "Why this data may be used",
            level: 2,
          },
          modules: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "Technical data may be processed to make the website available, keep it secure, prevent abuse, diagnose faults, and maintain reliable performance.",
                },
              ],
            },
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "Where messages are received through linked social platforms, the information you choose to provide may be used to read and respond to your enquiry.",
                },
              ],
            },
          ],
        },

        {
          kind: "contentSection",
          heading: {
            text: "Lawful basis",
            level: 2,
          },
          modules: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "Where personal data is processed for the operation, security, and maintenance of the website, the lawful basis is legitimate interests.",
                },
              ],
            },
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "Where you choose to make contact through an external platform, the lawful basis may also include taking steps at your request or responding to your communication.",
                },
              ],
            },
          ],
        },

        {
          kind: "contentSection",
          heading: {
            text: "Third parties",
            level: 2,
          },
          modules: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "This website is delivered using Cloudflare infrastructure. As part of providing edge delivery, security, and network services, Cloudflare may process technical request data on behalf of the site operator.",
                },
              ],
            },
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "If you choose to contact Kevin Ellen through a social media platform linked from the site, that platform will process your data in accordance with its own privacy policy.",
                },
              ],
            },
          ],
        },

        {
          kind: "contentSection",
          heading: {
            text: "Retention",
            level: 2,
          },
          modules: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "Technical data is not kept for longer than is reasonably necessary for security, operational, or diagnostic purposes.",
                },
              ],
            },
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "Where messages are received through external platforms, retention will depend on the platform used and whether ongoing communication is needed.",
                },
              ],
            },
          ],
        },

        {
          kind: "contentSection",
          heading: {
            text: "Your rights",
            level: 2,
          },
          modules: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "Depending on the circumstances, you may have the right to request access to your personal data, ask for it to be corrected or erased, object to certain processing, request restriction of processing, or complain to a data protection authority.",
                },
              ],
            },
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "If you are based in the United Kingdom, you can raise concerns with the Information Commissioner’s Office.",
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
                    "If you have any questions about this privacy information, please get in touch via social media. Links to active profiles are available in the site footer.",
                },
              ],
            },
          ],
        },

        {
          kind: "contentSection",
          heading: {
            text: "Changes",
            level: 2,
          },
          modules: [
            {
              kind: "paragraph",
              content: [
                {
                  kind: "text",
                  value:
                    "This page may be updated from time to time to reflect changes to the website, its infrastructure, or applicable legal requirements.",
                },
              ],
            },
          ],
        },
      ],
    },
  });
