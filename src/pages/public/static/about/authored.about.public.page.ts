// src/pages/public/static/about/authored.about.public.page.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredAboutPage: AuthoredPublicPageDefinition = deepFreeze({
  id: "about",
  kind: "static",
  slug: "/about",
  label: "About",

  metadata: {
    pageTitle: "About | Kevin Ellen",
    metaDescription: "About Page meta description.",
  },

  breadcrumbs: ["home", "about"],

  content: {
    header: {
      eyebrow: "Kevin Ellen",
      title: "About me",
      intro:
        "This site brings together two long-standing interests: nature and technology. It is a place to share photography, field notes, and journal writing alongside the technical thinking, architecture, and systems work that shape how the platform itself is built.",
    },

    content: [
      {
        kind: "contentSection",
        heading: {
          text: "A bit about me",
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
                  "I am a technical SEO professional based in south-east England, on the border between London and Essex. Much of my time is spent around Epping Forest, a place I have been drawn to since moving to this area. Forests, and especially mountainous areas, are where I feel most at home.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "In 2024 I picked up my dad’s old camera, and that simple decision quickly turned into something much bigger. Since then, I have travelled with my own camera, using it as a way to explore, observe, and document the natural world more closely.",
              },
            ],
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "Nature",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Wildlife and nature matter deeply to me. I enjoy being fully immersed in it — paying attention to the forest floor, the textures of foliage and shrubs, while always keeping an eye out for movement, whether it is something small and hidden or larger and more obvious.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Photography gives me a way to capture and share those moments. In a time dominated by screens and constant noise, I hope that sharing these observations encourages others to reconnect with nature and experience it for themselves.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "An important part of nature photography is travel. I tend to stay close to nature, away from busy urban and tourist-heavy areas, and instead seek out places where culture and landscape meet.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "If you are curious about what I bring on these trips, you can explore the ",
              },
              {
                kind: "internalLink",
                link: {
                  kind: "internal",
                  id: "about-equipment",
                  text: "photography equipment page",
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
          text: "Technology quote",
          visuallyHidden: true,
          level: 2,
        },
        modules: [
          {
            kind: "quote",
            id: "technology-quote",
            text: "Technology is the campfire around which we tell our stories.",
            attribution: "Laurie Anderson",
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "Technology",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Technology has always fascinated me in the same way. I am interested in how systems are built, how they can be optimised, and how people discover and interact with content online.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "The web sits at a unique crossroads between machine and human. It allows us to create carefully structured, high-performance systems while still delivering meaningful experiences to people. That balance is something I continue to explore and refine.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "If you want to dive deeper into how this site is built, the ",
              },
              {
                kind: "internalLink",
                link: {
                  kind: "internal",
                  id: "about-technology",
                  text: "technology section",
                },
              },
              {
                kind: "text",
                value:
                  " explores the architecture, decisions, and systems behind it.",
              },
            ],
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "Cross-roads",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "At first glance, nature and technology might seem unrelated. But the more time I spend with both, the more similarities I see. Nature is an incredibly well-balanced system, where everything has a role and purpose.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "That same philosophy applies to how I approach technical work. I aim for clarity, simplicity, and intention — where every part of a system has a reason to exist and contributes to the whole.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "In many ways, this website reflects that idea: something carefully structured, but still natural to explore.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value: "That same idea runs through both the ",
              },
              {
                kind: "internalLink",
                link: {
                  kind: "internal",
                  id: "about-equipment",
                  text: "photography equipment page",
                },
              },
              {
                kind: "text",
                value: " and the ",
              },
              {
                kind: "internalLink",
                link: {
                  kind: "internal",
                  id: "about-technology",
                  text: "technology section",
                },
              },
              {
                kind: "text",
                value:
                  ", which look at the practical and technical sides of the site in more detail.",
              },
            ],
          },
        ],
      },

      {
        kind: "contentSection",
        heading: {
          text: "Final words",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "This has been a journey on multiple levels; learning how to work with new systems, building this platform, and developing my photography at the same time.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "I am still not entirely sure whether climbing wet rocks in Bergen is easier or harder than building this website, but I know that I have enjoyed both. Though, if I had to choose, being out in nature probably wins.",
              },
            ],
          },
        ],
      },
    ],
  },
});
