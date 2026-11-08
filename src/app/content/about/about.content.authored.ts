// src/app/content/about/about.content.authored.ts

import type { PublicContentAuthored } from "../../../content-schema/content/public.content.content-schema.authored.type";

export const aboutContentAuthored = {
  kind: "public",
  render: "static",
  pageType: "standard",
  id: "about",
  slug: "/about",
  label: "About",
  breadcrumbs: ["home", "about"],

  dates: {
    created: "2026-04-26",
    lastUpdated: "2026-10-27",
  },

  metadata: {
    title: "About | Wildlife Photographer in Essex",
    description:
      "Meet Kevin Ellen, an independent wildlife and nature photographer based in Loughton, Essex, near Epping Forest. Exploring wildlife behaviour, local nature and journeys further afield.",
    sitemap: true,
  },

  body: {
    modules: [
      {
        kind: "editorialIntro",
        eyebrow: "About",
        title: "A little about me.",
        statement: "Wildlife, wild places, and the moments in between.",
        description:
          "I'm Kevin, an independent wildlife and nature photographer based in Loughton, Essex, on the doorstep of Epping Forest.",
        location: "Loughton, Essex, England",
        portrait: {
          kind: "editorialPhoto",
          src: "/assets/images/kevin-ellen-photography-in-albania-optimised-2026-08-28.jpg",
          alt: "Kevin Ellen outdoors in Albania, wearing a cap and backpack",
          width: 1,
          height: 1,
          priority: true,
        },
      },

      {
        kind: "editorialSplit",
        id: "approach-to-photography",
        reverse: true,
        eyebrow: "Approach to photography",
        heading: {
          id: "approach-heading",
          text: "An observer first.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "I'm drawn to wildlife behaviour, unexpected interactions and the small moments that are easy to overlook.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Sometimes the best encounters happen when I stop searching and simply pay attention.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "link",
                link: {
                  kind: "internal",
                  variant: "editorial-subtle",
                  pageId: "approach-to-photography",
                  label: "Explore my approach to photography",
                },
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/cattle-egrets-annoying-dad.jpg",
          alt: "Cattle egrets displaying and interacting in vegetation",
          width: 800,
          height: 533,
        },
      },

      {
        kind: "editorialFeature",
        id: "local-in-essex",
        eyebrow: "Local in Essex",
        heading: {
          id: "local-in-essex-heading",
          text: "Close to home.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Living in Loughton puts Epping Forest practically on my doorstep, but Essex has far more to offer than woodland. From ancient trees and quiet forest paths to open marshes, estuaries and the coastline, there's an extraordinary variety of habitats to explore.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Some of my favourite encounters have happened close to home, often in places I've visited countless times before.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "link",
                link: {
                  kind: "internal",
                  variant: "editorial-subtle",
                  pageId: "local-in-essex",
                  label: "Explore my local photography",
                },
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/black-headed-gull-flying-over-essex-coast.jpg",
          alt: "A black-headed gull flying over the Essex coastline near Southend",
          width: 1400,
          height: 569,
          description:
            "A black-headed gull cruising along the Essex coast, with Southend Pier in the background. Probably going somewhere important, like stealing chips from the pier.",
        },
      },

      {
        kind: "editorialSplit",
        id: "travels",
        eyebrow: "Travels",
        heading: {
          id: "travels-heading",
          text: "A little further afield.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "While Essex is home, I enjoy exploring different environments whenever I travel. From forests and wetlands to mountains and coastlines, there's always something new to discover.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Travelling gives me a chance to encounter unfamiliar wildlife, learn about different habitats and experience landscapes that are quite unlike those back home.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "link",
                link: {
                  kind: "internal",
                  variant: "editorial-subtle",
                  pageId: "travels",
                  label: "Discover my travels",
                },
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/estonia-viru-bog-reflections.jpg",
          alt: "Pine trees and autumn vegetation reflected in still bog water beneath a dramatic sky at Viru Bog in Estonia",
          description:
            "Viru Bog, Estonia. A rare moment when the sky put on a proper show and the water decided to copy it. Not a bad reward for an early start.",

          width: 792,
          height: 1061,
        },
      },

      {
        kind: "editorialSplit",
        id: "equipment",
        eyebrow: "Equipment",
        heading: {
          id: "equipment-heading",
          text: "What comes along.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "I tend to keep my equipment relatively simple. Most of my wildlife photography is taken with the same camera and telephoto lens, whether I'm exploring Epping Forest or travelling further afield.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "The equipment helps me get closer to the action, but knowing when to stop, watch and wait matters far more than what's in my bag.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "link",
                link: {
                  kind: "internal",
                  variant: "editorial-subtle",
                  pageId: "equipment",
                  label: "More about my equipment",
                },
              },
            ],
          },
        ],
        media: {
          kind: "richList",
          items: [
            {
              icon: { id: "icon-camera" },
              label: "Camera",
              values: ["Canon EOS R7"],
            },
            {
              icon: { id: "icon-aperture" },
              label: "Lens & extender",
              values: ["RF 100–500mm f/4.5–7.1 L IS USM", "RF 1.4× Extender"],
            },
            {
              icon: { id: "icon-hiking" },
              label: "Out in the field",
              values: [
                "Vanguard VEO Active 53 backpack",
                "BlackRapid Curve Breathe camera sling",
              ],
            },
          ],
        },
      },

      {
        kind: "banner",
        heading: {
          id: "about-closing-title",
          text: "There's always something worth noticing.",
          level: 2,
        },
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/glossy-ibis-flying-in-front-of-lush-vegetation.jpg",
          alt: "",
          width: 3,
          height: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "As a proud member of the Coot Appreciation Club, I consider it my duty to enjoy nature wherever I go. Whether that's a walk through Epping Forest, exploring somewhere new, or simply stopping to watch a bird doing something ridiculous.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Of course, not every outing produces great photographs. Sometimes the light doesn't cooperate, the wildlife has other plans, or I come home with very little to show for it.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "But spending time outdoors is often reason enough to go in the first place. The photographs are a bonus.",
              },
            ],
          },
        ],
      },
    ],
  },
} as const satisfies PublicContentAuthored;
