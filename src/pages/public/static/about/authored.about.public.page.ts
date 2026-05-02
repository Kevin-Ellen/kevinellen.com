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
    metaDescription:
      "Wildlife photographer and technical SEO specialist building a personal platform for field notes, photography, and edge-native systems.",
  },

  breadcrumbs: ["home", "about"],

  content: {
    header: {
      eyebrow: "Kevin Ellen",
      title: "About me",
      intro:
        "This site brings together two long-standing interests: wildlife and technology. It is a place for photography, field notes, journal writing, and the technical thinking behind the platform itself.",
    },

    content: [
      {
        kind: "articleSection",
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
                  "I am a technical SEO professional based in south-east England, on the border between London and Essex. I spend a lot of time around Epping Forest, a place I have loved since moving to the area. Forests, mountains, and quiet natural spaces are where I feel most at home.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "In 2024 I picked up my dad’s old camera. That simple decision quickly turned into something much bigger. Since then, I have travelled with my own camera, using it to explore, observe, and document the natural world more closely.",
              },
            ],
          },
        ],
      },

      {
        kind: "articleSection",
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
                  "Wildlife and nature matter deeply to me. I enjoy being fully immersed in it: watching the forest floor, noticing textures in foliage and shrubs, and keeping an eye out for movement. Sometimes it is something small and hidden. Sometimes it is much more obvious.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Photography gives me a way to capture and share those moments. In a world full of screens and constant noise, I hope these observations encourage others to reconnect with nature and experience it for themselves.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Travel is an important part of nature photography for me. I tend to stay close to natural spaces, away from busy urban and tourist-heavy areas. I am drawn to places where culture and landscape meet.",
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
        kind: "articleSection",
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
        kind: "articleSection",
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
                value: "Technology fascinates me too.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "I am interested in how systems are built, how they can be improved, and how people discover and interact with content online.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "The web sits between machines and people. It lets us build structured, high-performance systems while still creating meaningful experiences. That balance is something I keep exploring.",
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
        kind: "articleSection",
        heading: {
          text: "Where they meet",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "At first glance, nature and technology might seem unrelated. The more time I spend with both, the more similarities I see. Nature is a balanced system, where every part has a role.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "That same idea shapes how I approach technical work. I aim for clarity, simplicity, and intention. Every part of a system should have a reason to exist.",
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
        kind: "articleSection",
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
                  "This has been a journey on several levels: learning new systems, building this platform, and developing my photography at the same time.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "I am still not sure whether climbing wet rocks in Bergen is easier or harder than building this website. I enjoyed both. But if I had to choose, being out in nature probably wins.",
              },
            ],
          },
        ],
      },
    ],
  },
});
