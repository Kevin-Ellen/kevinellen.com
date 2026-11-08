// src/app/content/about/travels.about.content.authored.ts

import type { PublicContentAuthored } from "../../../content-schema/content/public.content.content-schema.authored.type";

export const travelsAboutContentAuthored = {
  kind: "public",
  render: "static",
  pageType: "standard",
  id: "travels",
  slug: "/about/travels",
  label: "Travels",
  breadcrumbs: ["home", "about", "travels"],
  dates: {
    created: "2026-10-28",
  },

  metadata: {
    title: "Travels & Photography",
    description:
      "Explore Kevin Ellen's travels, encounters with wildlife and experiences photographing nature and landscapes across different countries and environments.",
    sitemap: true,
  },
  body: {
    modules: [
      {
        kind: "editorialIntro",
        eyebrow: "Travels",
        title: "A little further afield.",
        statement:
          "Different landscapes, unfamiliar wildlife, and the occasional unexpected adventure.",
        description:
          "I enjoy exploring places beyond the familiar woodlands and wetlands of Essex. Whether it's wandering through northern forests, discovering remote landscapes or watching wildlife somewhere completely new, travelling gives me a different perspective on the natural world.",
        portrait: {
          kind: "editorialPhoto",
          src: "/assets/images/penijoe-trail-estonia.jpg",
          alt: "Flooded grassland and autumn vegetation beneath a partly cloudy sky along the Penijõe Trail in Estonia",
          width: 500,
          height: 376,
          priority: true,
        },
      },

      {
        kind: "editorialSplit",
        id: "discovering-habitats",
        reverse: true,
        eyebrow: "Discovering new habitats",
        heading: {
          id: "discovering-habitats-heading",
          text: "Somewhere unfamiliar.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "One of my favourite parts of travelling is discovering how different the natural world can be. From the damp forests and wetlands of northern Europe to the dry, sun-baked landscapes of the Mediterranean, every environment has its own character and wildlife.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Sometimes that means encountering an animal I've never seen in the wild before, like a Hermann's tortoise wandering through the sandy scrubland of Mallorca. Other times it's simply noticing how familiar species behave differently somewhere new. Either way, there's usually something worth stopping for.",
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/hermanns-tortoise-son-real-mallorca.jpg",
          alt: "A Hermann's tortoise walking across sandy ground among dry Mediterranean vegetation at Son Real, Mallorca",
          width: 800,
          height: 533,
          description:
            "A Hermann's tortoise at Son Real, Mallorca. The dry, sandy terrain and its beautifully patterned shell were a world away from the wildlife I'm used to finding around Essex. And unlike most birds, this one wasn't in a tremendous hurry.",
        },
      },

      {
        kind: "editorialSplit",
        id: "wildlife-encounters",
        eyebrow: "Wildlife encounters",
        heading: {
          id: "wildlife-encounters-heading",
          text: "Different places, different characters.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "One of the best parts of travelling is coming across wildlife that feels completely unfamiliar. Sometimes it's a species I've never seen before, other times it's the setting or behaviour that makes the moment memorable.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "This water monitor appeared in the lake at my hotel in Ao Nang, Krabi, looking far more prehistoric than anything has a right to look on a casual walk. Encounters like that are part of the fun. You never quite know what might turn up next.",
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/asian-water-monitor-swimming-in-ao-nang-krabi-thailand.jpg",
          alt: "An Asian water monitor swimming through green water in Ao Nang, Krabi, Thailand",
          width: 800,
          height: 533,
          description:
            "An Asian water monitor cruising through the water in Ao Nang, Krabi. I was expecting a quiet wander around the resort, not a small dragon.",
        },
      },

      {
        kind: "editorialFeature",
        id: "landscapes-and-experiences",
        eyebrow: "Landscapes & experiences",
        heading: {
          id: "landscapes-and-experiences-heading",
          text: "The journey is part of the story.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Some of my favourite travel experiences have involved getting up far too early, heading somewhere unfamiliar and seeing what I find along the way. Whether it's following a trail through a forest, crossing an open landscape or exploring a coastline, I enjoy the journey as much as the destination.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Photography gives me a reason to venture beyond the usual places and spend time exploring environments I might otherwise never experience. I often come away knowing a little more about the landscape, its wildlife and the place itself. And occasionally, I even remember to take some photographs.",
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/path-near-albanian-coast.jpg",
          alt: "A sandy track winding between pine woodland and a canal near the Albanian coast",
          width: 1400,
          height: 560,
          description:
            "A sandy track along the Albanian coast, with pine woodland on one side and water on the other. No particular destination in mind, just another path worth exploring.",
        },
      },
    ],
  },
} as const satisfies PublicContentAuthored;
