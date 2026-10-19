// src/pages/public/static/about/authored.about.public.page.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";
import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredAboutPage: AuthoredPublicPageDefinition = deepFreeze({
  id: "about",
  kind: "static",
  slug: "/about",
  label: "About",

  metadata: {
    pageTitle: "About Kevin Ellen | Wildlife Photographer in Essex",
    metaDescription:
      "Kevin Ellen is an independent wildlife and nature photographer based in Loughton, Essex, near Epping Forest. Explore his photography, field journals and technical work.",
  },

  breadcrumbs: ["home", "about"],

  content: {
    head: {
      eyebrow: "Kevin Ellen",
      title: "About me",
      intro:
        "I'm an independent wildlife and nature photographer based in Loughton, Essex, near Epping Forest. I photograph the natural world close to home and during my travels, and I work professionally in technology and engineering.",
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
                  "Epping Forest has been a familiar place since I moved to the area. I love forests, mountains, wetlands and quiet natural spaces, and I am happiest taking my time to explore them. Living in Loughton means I have the forest close by, with plenty to observe without travelling far.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "In 2024 I picked up my dad's old camera. That simple decision quickly turned into something much bigger. Since then, photography has given me another reason to slow down, look more closely and document the natural world around me.",
              },
            ],
          },
        ],
      },

      {
        kind: "articleSection",
        heading: {
          text: "Nature & photography",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "What interests me most about wildlife is behaviour and character. I enjoy the small interactions, unexpected expressions and occasionally absurd moments that reveal something about an animal beyond its species name. A photograph can be technically good, but I especially like it when it tells a story.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "I pay just as much attention to the surroundings: the forest floor, textures in foliage, changing light and the habitats that make an encounter possible. Wildlife is part of a wider environment, and that context matters to me as much as the subject itself.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "I photograph nature locally around Epping Forest and Essex, as well as when travelling abroad. My journeys often take me away from busy tourist areas and towards forests, mountains and wetlands, especially places where landscape and culture meet. I share my own photographs, observations and field journals here on the site.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Photography is a way to share those encounters, but I hope it also encourages someone to go outside and notice what is happening around them. If you're curious about the kit I take into the field, have a look at my ",
              },
              {
                kind: "internalLink",
                link: {
                  kind: "internal",
                  id: "about-equipment",
                  text: "photography equipment",
                },
              },
              { kind: "text", value: "." },
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
          text: "Technology & engineering",
          level: 2,
        },
        modules: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Away from the camera, my professional background is in technical SEO. Over time, my work has increasingly moved towards software engineering, solution architecture and automation. I enjoy understanding how systems work, finding where they fall short and building something better.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "That might mean designing an architecture, writing application code or connecting services. I care about clear responsibilities, maintainable solutions and the practical work of turning an idea into something that runs.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "This website is one example. I built it as a small edge-native platform for photography and writing, rather than using an off-the-shelf content management system. The ",
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
                  " explains the architecture and the decisions behind it.",
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
                  "Nature and technology occupy different parts of my life, but both reward curiosity, patience and attention to detail. In the field I watch and wait; at a keyboard I investigate, test and refine. Neither always goes to plan, which is part of the appeal.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "This site brings those interests together. The technology provides a home for the photographs and stories, but the natural world is the reason I keep heading outside to make more of them.",
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
                  "I'm still learning, both behind the camera and while building the platform that holds the results. That's part of what makes it enjoyable.",
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
