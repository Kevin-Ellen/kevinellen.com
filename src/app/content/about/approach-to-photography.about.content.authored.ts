// src/app/content/about/approach-to-photography.about.content.authored.ts

import type { PublicContentAuthored } from "../../../content-schema/content/public.content.content-schema.authored.type";

export const approachToPhotographyAboutContentAuthored = {
  kind: "public",
  render: "static",
  pageType: "standard",
  id: "approach-to-photography",
  slug: "/about/approach-to-photography",
  label: "Approach to Photography",
  breadcrumbs: ["home", "about", "approach-to-photography"],
  dates: {
    created: "2026-10-28",
  },

  metadata: {
    title: "My Approach to Wildlife Photography",
    description:
      "Explore Kevin Ellen's approach to wildlife and nature photography, from observing animal behaviour and working with natural light to photographing wildlife responsibly.",
    sitemap: true,
  },
  body: {
    modules: [
      {
        kind: "editorialIntro",
        eyebrow: "Approach to photography",
        title: "A little more than a photograph.",
        statement:
          "How I experience, observe and photograph wildlife and nature.",
        description:
          "For me, photography isn't just about the final image. It's about being out there, watching, listening and noticing the behaviour, interactions and small moments that make wildlife so fascinating.",
        portrait: {
          kind: "editorialPhoto",
          src: "/assets/images/elephant-eye-and-wrinkles.jpg",
          alt: "Black and white close-up photo of an elephant's eye showing wrinkles and skin texture.",
          width: 500,
          height: 333,
          priority: true,
        },
      },

      {
        kind: "editorialSplit",
        id: "observation",
        eyebrow: "Observation",
        reverse: true,
        heading: {
          id: "observation-heading",
          text: "The moments in between.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Some of the most rewarding wildlife encounters aren't necessarily the obvious ones. It's the unexpected behaviour, a brief interaction, or a glimpse into how a species lives and adapts.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "I enjoy taking the time to watch, understand what's happening and let the scene unfold naturally. That curiosity, and a bit of patience, often leads to far more interesting stories than a straightforward photograph.",
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/kestrel-with-prey-flying.jpg",
          alt: "A kestrel flying with a vole in its talons against a grey backdrop",
          width: 800,
          height: 533,
          description:
            "A kestrel carrying a vole after a successful hunt. A fleeting glimpse of the relationship between predator and prey.",
        },
      },

      {
        kind: "editorialSplit",
        id: "fieldcraft",
        eyebrow: "Fieldcraft",
        heading: {
          id: "fieldcraft-heading",
          text: "Learning to read the signs.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Wildlife rarely announces what it's about to do. Learning to recognise behaviour, whether that's a bird preparing to take flight, a territorial display or the beginnings of courtship, helps me anticipate what might happen next.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "These great crested grebes are a good example. Watching how they interacted and responded to one another was just as important as having the camera ready. Understanding the behaviour makes it easier to recognise those fleeting moments before they're gone.",
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/great-crested-grebes-courting.jpg",
          alt: "Two great crested grebes facing each other, their bills almost touching during a courtship display",
          width: 800,
          height: 533,
          description:
            "These two were rather engrossed in each other. Watching their elaborate courtship unfold was fascinating, although I did feel like I was intruding on a private moment.",
        },
      },

      {
        kind: "editorialFeature",
        id: "reflection",
        eyebrow: "Reflection",
        heading: {
          id: "reflection-heading",
          text: "Not every outing needs a photograph.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Some days, the light is terrible, the wildlife is nowhere to be seen, or everything disappears the moment I lift my camera. That's just how it goes when photographing nature.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "But I don't consider those days wasted. There's still the experience of being outdoors, discovering somewhere new, hearing a woodpecker in the distance or simply enjoying a few hours away from everything.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "If I come home with a photograph I'm happy with, brilliant. If not, I've usually had a pretty good day anyway.",
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/misty-cloudy-snow-topped-mountain-range-in-kaerten-austria.jpg",
          alt: "Snow-covered mountains emerging through thick brown-grey clouds above a dark, forested valley in Kärnten, Austria",
          width: 1400,
          height: 560,
          description:
            "September in Kärnten, Austria. An unexpected amount of snow, thick clouds and an almost sepia-coloured landscape. Those strange brown-grey tones were exactly how it looked, not a photographic effect. Not quite the September weather I'd expected, but rather spectacular.",
        },
      },
    ],
  },
} as const satisfies PublicContentAuthored;
