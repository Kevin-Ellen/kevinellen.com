// src/app/content/legal/privacy.legal.content.authored.ts

import type { PublicContentAuthored } from "../../../content-schema/content/public.content.content-schema.authored.type";

export const privacyLegalContentAuthored = {
  kind: "public",
  render: "static",
  pageType: "standard",
  id: "privacy",
  slug: "/legal/privacy",
  label: "Privacy",
  breadcrumbs: ["home", "privacy"],
  dates: {
    created: "2026-04-13",
    lastUpdated: "2026-10-26",
  },
  metadata: {
    title: "Privacy Policy",
    description:
      "How kevinellen.com handles technical request data, Cloudflare logs and analytics, cookies, social enquiries and visitor privacy.",
    sitemap: true,
  },
  body: {
    modules: [
      {
        kind: "pageIntro",
        eyebrow: "Legal",
        title: "Privacy Policy",
        description:
          "No Google Analytics, advertising trackers or visitor profiling. Cloudflare may process technical request information to deliver, protect and monitor this website. Here is what that means for your privacy.",
      },
      {
        kind: "articleSection",
        heading: {
          id: "my-approach-to-privacy",
          text: "My approach to privacy",
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
                        "kevinellen.com is a personal wildlife and nature photography website operated by Kevin Ellen. It exists to share photographs, field journals and observations from the natural world.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "I do not use Google Analytics, advertising pixels or cross-site marketing trackers, and I do not build individual visitor profiles. I do use Cloudflare to operate, protect and monitor the website, which means technical request information may be collected and available to me.",
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
          id: "cookies-and-analytics",
          text: "Cookies and analytics",
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
                        "The website does not deliberately use cookies for advertising or personalisation. Cloudflare may set necessary cookies when particular security or protection features are used.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "Cloudflare provides traffic, performance and security analytics that I may use to understand general website activity, investigate errors and improve reliability. These are distinct from advertising or cross-site tracking.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "I may also enable Cloudflare Web Analytics, which uses a browser-side JavaScript beacon to measure page views and website performance without using cookies or collecting personal data, according to Cloudflare. This does not mean the feature is currently enabled.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value: "For details, see ",
                    },
                    {
                      kind: "link",
                      link: {
                        kind: "external",
                        href: "https://developers.cloudflare.com/web-analytics/about/",
                        label: "Cloudflare Web Analytics documentation",
                        target: "_blank",
                        rel: ["noopener", "noreferrer"],
                      },
                    },
                    {
                      kind: "text",
                      value: " and ",
                    },
                    {
                      kind: "link",
                      link: {
                        kind: "external",
                        href: "https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/",
                        label: "Cloudflare’s cookie documentation",
                        target: "_blank",
                        rel: ["noopener", "noreferrer"],
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
          id: "information-that-may-be-processed",
          text: "Information that may be processed",
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
                        "When you visit, technical information may be processed through Cloudflare. Depending on the service and configuration, this may include IP addresses, requested URLs, timestamps, browser and device information, approximate geographic information, response status, and connection or security details.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "I may access some of this information through Cloudflare dashboards, analytics and Workers invocation logs, for example to troubleshoot errors, investigate abuse or assess website performance.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "I do not run a separate visitor database or deliberately build browsing histories or profiles of individual visitors.",
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
          id: "cloudflare-infrastructure-and-logging",
          text: "Cloudflare infrastructure and logging",
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
                        "The website is delivered using Cloudflare Workers, content delivery, image delivery and network security services. Cloudflare processes technical request information to provide these services.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "Cloudflare Workers Logs may record invocation details, request and response information, errors and application diagnostics. I may inspect these logs when needed for operational or security purposes.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value: "You can read ",
                    },
                    {
                      kind: "link",
                      link: {
                        kind: "external",
                        href: "https://www.cloudflare.com/privacypolicy/",
                        label: "Cloudflare’s Privacy Policy",
                        target: "_blank",
                        rel: ["noopener", "noreferrer"],
                      },
                    },
                    {
                      kind: "text",
                      value: ", ",
                    },
                    {
                      kind: "link",
                      link: {
                        kind: "external",
                        href: "https://developers.cloudflare.com/workers/observability/logs/workers-logs/",
                        label: "Workers Logs documentation",
                        target: "_blank",
                        rel: ["noopener", "noreferrer"],
                      },
                    },
                    {
                      kind: "text",
                      value: " and ",
                    },
                    {
                      kind: "link",
                      link: {
                        kind: "external",
                        href: "https://developers.cloudflare.com/analytics/types-of-analytics/",
                        label: "Cloudflare Analytics documentation",
                        target: "_blank",
                        rel: ["noopener", "noreferrer"],
                      },
                    },
                    {
                      kind: "text",
                      value:
                        " for more information about Cloudflare’s services and data handling.",
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
          id: "why-information-may-be-processed",
          text: "Why information may be processed",
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
                        "Technical information may be processed to deliver the website, maintain security, prevent abuse, investigate errors, measure performance and understand general traffic. Where personal data is involved, I generally rely on legitimate interests in operating, securing and improving the website.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "If you contact me voluntarily, information you provide may be used to respond to your enquiry or take steps you request, including discussing a photography licence. The applicable lawful basis depends on the nature of the communication.",
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
          id: "contact-and-social-media",
          text: "Contact and social media",
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
                        "If you contact me through a social platform, I may receive the profile information and messages you choose to share. I use that information to read and respond to enquiries.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "Social platforms process information under their own privacy policies, independently of this website.",
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
          id: "data-retention",
          text: "Data retention",
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
                        "Cloudflare may retain technical request information and operational logs in accordance with the services used, account settings and applicable retention periods. The exact duration varies by product and configuration.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "I do not routinely export or separately store individual visitor request records. I may review available logs and analytics for troubleshooting, security or performance.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "Social media correspondence may be kept as long as reasonably needed to handle an enquiry or maintain relevant records; the platform may retain its own copies.",
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
          id: "your-data-protection-rights",
          text: "Your data protection rights",
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
                        "Depending on the circumstances, UK data protection law may give you rights to access personal data, request correction or deletion, restrict processing, or object to certain uses.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value:
                        "These rights depend on the information involved and the applicable legal conditions. I may not hold records identifying you as an individual visitor.",
                    },
                  ],
                },
                {
                  kind: "paragraph",
                  content: [
                    {
                      kind: "text",
                      value: "You can also contact the ",
                    },
                    {
                      kind: "link",
                      link: {
                        kind: "external",
                        href: "https://ico.org.uk/",
                        label: "Information Commissioner’s Office (ICO)",
                        target: "_blank",
                        rel: ["noopener", "noreferrer"],
                      },
                    },
                    {
                      kind: "text",
                      value:
                        " if you have concerns about how personal information is handled in the United Kingdom.",
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
          id: "privacy-enquiries",
          text: "Privacy enquiries",
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
                        "For questions about this policy or how information is handled, contact me through ",
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
                        "Please avoid posting sensitive personal information publicly. Use a private message where available.",
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
          id: "changes-to-this-policy",
          text: "Changes to this policy",
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
                        "This policy may be updated to reflect changes in the website, the Cloudflare services enabled or applicable privacy requirements.",
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
