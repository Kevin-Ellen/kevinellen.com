// src/app/content/pages/public/about/technology.about.page.ts

import type { TechnologyAboutPageDefinition } from "@shared-types/content/pages/public/about-technology/technology.about.public.page.definition";

export const technologyAboutPage: TechnologyAboutPageDefinition = {
  core: {
    id: "about-technology",
    kind: "longForm",
    label: "Technology",
    slug: "/about/technology",
  },

  meta: {
    pageTitle: "Technology",
    metaDescription:
      "How this site is built using Cloudflare Workers, TypeScript, and a structured rendering pipeline.",
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

  breadcrumbs: ["home", "about", "about-technology"],

  content: {
    head: {
      eyebrow: "About",
      title: "Technology",
      intro:
        "This site is built as a small, structured system instead of using a traditional CMS. The goal is to keep things predictable, fast, and easy to reason about.",
    },

    body: [
      {
        kind: "contentSection",
        heading: {
          text: "The idea behind the site",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "I wanted a site that reflects both my photography and my technical work. That meant building something simple, where I understand every part of how a page is created and delivered.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Instead of relying on a CMS or theme, everything is defined in code and rendered in a predictable way. This keeps the system small and avoids unnecessary complexity.",
              },
            ],
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "Infrastructure",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "The site runs on Cloudflare Workers. Pages are generated at the edge, which keeps response times low and removes the need for a traditional server setup.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Infrastructure is managed with Terraform and executed through Spacelift. This keeps environments consistent and avoids manual configuration in dashboards.",
              },
            ],
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "How content is structured",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Content is written manually and structured using typed objects. There is no CMS interface. This keeps the content predictable and avoids mixing editing concerns with runtime behaviour.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Static pages like this one are bundled with the application. Other types of content, such as articles or journals, can be stored separately and composed at request time when needed.",
              },
            ],
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "From request to page",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Each request goes through a small pipeline. The request is first resolved and checked against policies such as redirects or canonical rules. After that, the correct page is selected.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "The page is then passed through a series of steps that prepare the data needed for rendering. This includes navigation, breadcrumbs, metadata, and structured data.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Finally, the renderer turns that data into HTML. The renderer itself stays simple and only outputs what it is given, without adding its own logic.",
              },
            ],
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "How rendering works",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Rendering is split into small parts such as the document head, page content, and footer. Each part is generated separately and then combined into a complete document.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Because everything is structured and typed, the output is consistent and easier to test. This also makes it easier to extend the site without unexpected side effects.",
              },
            ],
          },
        ],
      },
      {
        kind: "contentSection",
        heading: {
          text: "Publishing while travelling",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "The site is designed around practical publishing, not just page rendering. When I am travelling, I may be working from a hotel, on mobile data, or tethered to my phone after a long day outdoors. In those moments I want the process to be quick, predictable, and light on data transfer.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "That is one of the reasons I do not use a traditional CMS. I avoid slow admin interfaces, large dashboard payloads, and publishing flows that break down on weaker connections. The largest part of any upload should usually be the photo itself, not the system around it.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "The site is built so content can be created simply and uploaded with minimal overhead. That makes it easier to publish field notes, updates, or new work after a day in nature without having to fight the platform first.",
              },
            ],
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "Why it is built this way",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "The goal is not to build something complex, but something clear. By keeping the system small and well-defined, it is easier to maintain and easier to improve over time.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "It also allows the site to act as both a portfolio and a reference for how I approach building systems: structured, predictable, and focused on doing one thing well.",
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
