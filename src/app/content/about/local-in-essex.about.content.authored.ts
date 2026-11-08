// src/app/content/about/local-in-essex.about.content.authored.ts

import type { PublicContentAuthored } from "../../../content-schema/content/public.content.content-schema.authored.type";

export const localInEssexAboutContentAuthored = {
  kind: "public",
  render: "static",
  pageType: "standard",
  id: "local-in-essex",
  slug: "/about/local-in-essex",
  label: "Local in Essex",
  breadcrumbs: ["home", "about", "local-in-essex"],
  dates: {
    created: "2026-10-28",
  },

  metadata: {
    title: "Wildlife Photography in Essex",
    description:
      "Discover Kevin Ellen's local wildlife photography around Essex, from Epping Forest to the county's woodlands, wetlands and nature reserves.",
    sitemap: true,
  },
  body: {
    modules: [
      {
        kind: "editorialIntro",
        eyebrow: "Local in Essex",
        title: "Wildlife on my doorstep.",
        statement:
          "From the ancient woodland of Epping Forest to the wetlands, estuaries and coastline of Essex.",
        description:
          "I'm based in Loughton, right beside Epping Forest, but my local photography takes me across Essex. It's a county full of contrasting habitats, familiar wildlife and the occasional unexpected encounter. There's always somewhere worth exploring.",
        portrait: {
          kind: "editorialPhoto",
          src: "/assets/images/female-fallow-deer-in-epping-forest.jpg",
          alt: "A female fallow deer standing among trees in Epping Forest, Essex",
          width: 500,
          height: 333,
          priority: true,
        },
      },

      {
        kind: "editorialSplit",
        id: "epping-forest",
        reverse: true,
        eyebrow: "Epping Forest",
        heading: {
          id: "epping-forest-heading",
          text: "Among the ancient trees.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Epping Forest is somewhere I return to throughout the year. The familiar paths change with the seasons, and even places I've walked countless times can reveal something completely unexpected.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "From fallow deer moving quietly through the woodland to woodpeckers calling overhead, there's plenty happening if you take the time to notice. Sometimes it's the smallest movement among the trees that catches my attention.",
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/foraging-wren-in-epping-forest.jpg",
          alt: "A Eurasian wren foraging among fallen leaves and branches on the woodland floor",
          width: 800,
          height: 640,
          description:
            "A tiny wren rummaging through the leaf litter in Epping Forest. Easy to miss among the fallen leaves, although that upright tail is a bit of a giveaway.",
        },
      },
      {
        kind: "editorialFeature",
        id: "wetlands-and-reserves",
        eyebrow: "Wetlands & nature reserves",
        heading: {
          id: "wetlands-heading",
          text: "Where the water takes over.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Away from the woodland, Essex opens up into reservoirs, marshes and wetlands, each with its own wildlife and character. Places like Abberton Reservoir offer a completely different experience from the familiar paths of Epping Forest.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "These are places where I can spend hours watching waterbirds, scanning the skies for raptors and following the constant activity around the water. There's often something happening in the distance, even when everything nearby seems quiet.",
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/tufted-duck-on-water-in-lea-valley.jpg",
          alt: "A male tufted duck floating on calm blue water, surrounded by concentric ripples",
          width: 1400,
          height: 276,
          description:
            "A male tufted duck on the water in Lea Valley, surrounded by almost perfectly concentric ripples. Even the water decided to cooperate with the composition.",
        },
      },

      {
        kind: "editorialSplit",
        id: "essex-coastline",
        eyebrow: "Essex coastline",
        heading: {
          id: "essex-coastline-heading",
          text: "Beyond the woodland.",
          level: 2,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "The Essex coastline offers a completely different landscape from the forests around Loughton. With its tidal estuaries, saltmarshes, mudflats and wide-open skies, there's an enormous amount of wildlife to discover.",
              },
            ],
          },
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "I particularly enjoy watching coastal birds going about their business. Waders searching the mud, gulls riding the wind and the occasional raptor passing overhead. It's a place where the tide dictates much of the activity, and there's always something worth watching.",
              },
            ],
          },
        ],
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/curlew-taking-flight-at-the-thames-estuary.jpg",
          alt: "A curlew taking flight over a muddy tidal creek at Two Tree Island, Essex",
          width: 800,
          height: 533,
          description:
            "A curlew taking off from a tidal creek at Two Tree Island. One moment it was minding its own business in the mud, the next it was airborne. Fortunately, I had the camera ready.",
        },
      },
    ],
  },
} as const satisfies PublicContentAuthored;
