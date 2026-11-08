// src/app/content/home.composed.content.authored.ts

import type { PublicContentAuthored } from "../../content-schema/content/public.content.content-schema.authored.type";

export const homeContentAuthored = {
  kind: "public",
  render: "composed",
  pageType: "standard",
  id: "home",
  slug: "/",
  label: "Home",
  breadcrumbs: ["home"],
  dates: {
    created: "2026-04-26",
    lastUpdated: "2026-10-30",
  },

  metadata: {
    title: "Wildlife & Nature Photography",
    description:
      "Wildlife and nature photography by Kevin Ellen, based in Loughton, Essex, near Epping Forest. Field journals documenting wildlife behaviour, natural habitats and encounters in Essex and beyond.",
    sitemap: true,
  },

  pagePresentation: {
    layout: "full-bleed",
    header: {
      appearance: "transparent",
      colourScheme: "inverted",
    },
  },

  body: {
    modules: [
      {
        kind: "hero",
        eyebrow: "Wildlife photography",
        title: ["Wild places,", "quiet moments"],
        description:
          "A field journal of wildlife encounters — capturing behaviour, fleeting moments, and the quiet details often missed at first glance.",

        media: {
          src: "/assets/images/homepage-hero-2x3.jpg",
          width: 2,
          height: 3,
          alt: "",
          fetchPriority: "high",
          sources: [
            {
              src: "/assets/images/homepage-hero-2560x720.jpg",
              media: "(min-width: 30rem)",
              width: 2560,
              height: 720,
            },
          ],
        },

        location: {
          label: "Rye Meads RSPB, Hertfordshire",
          icon: {
            id: "icon-location-dot",
          },
        },
      },

      {
        kind: "journalListing",
        heading: {
          id: "journal-listing-title",
          level: 2,
          text: "More from the journal",
        },
        eyebrow: "Latest entry",
        photoLimit: 3,
        pageSize: 5,
        pagination: false,
      },

      {
        kind: "banner",
        heading: {
          id: "about-title",
          level: 2,
          text: "About",
        },
        media: {
          kind: "editorialPhoto",
          src: "/assets/images/chaffinch-with-lychen-in-beak.jpg",
          alt: "Male chaffinch perched on a branch with lichen in its beak",
          width: 2100,
          height: 1400,
        },
        components: [
          {
            kind: "paragraph",
            content: [
              {
                kind: "text",
                value:
                  "Based in Loughton, Essex, I'm an independent wildlife and nature photographer, exploring the natural world close to home and further afield. My photography focuses on animal behaviour, unexpected encounters and the quieter moments often overlooked.",
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
                  pageId: "about",
                  label: "More about my approach",
                  variant: "editorial-subtle",
                },
              },
            ],
          },
        ],
      },
      {
        kind: "topicExplorer",
        heading: "Explore by topic",
        maxFeatured: 4,
      },
    ],
  },
} as const satisfies PublicContentAuthored;
