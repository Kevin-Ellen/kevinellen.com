// src/pages/public/static/authored.home.public.page.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredHomePublicPage: AuthoredPublicPageDefinition = deepFreeze({
  id: "home",
  kind: "home",
  slug: "/",
  label: "Home",

  metadata: {
    pageTitle: "Kevin Ellen | Wildlife Photography & Technical Work",
    metaDescription:
      "Wildlife photography, field notes, and technical work exploring observation, behaviour, and edge-native publishing.",
  },

  breadcrumbs: ["home"],

  content: {
    // Page identity only.
    // This should not drive the visible homepage hero layout.
    head: {
      eyebrow: "Kevin Ellen",
      title: "Home",
      intro:
        "Wildlife photography, field notes, articles, and transparent technical architecture.",
      showInBody: false,
    },

    content: [
      {
        kind: "homepageHero",
        eyebrow: "Wildlife & Technology",
        title: "Kevin Ellen",
        intro: [
          {
            kind: "text",
            value:
              "A field journal of wildlife encounters — capturing behaviour, fleeting moments, and the quiet details often missed at first glance.",
          },
        ],

        photoId: "juvenile-robin-magpie-krabi-thailand",
        primaryLink: {
          kind: "internal",
          id: "about",
          text: "Learn more about this site",
        },
      },

      {
        kind: "imageStrip",
        heading: {
          text: "Example photos",
          visuallyHidden: true,
          level: 2,
        },
        source: "homepage-strip",
        itemCount: 6,
        excludePagePhotos: true,
      },
      {
        kind: "homepageJournalListing",
        heading: {
          text: "Latest field notes",
          level: 2,
        },
        itemCount: 5,
      },
      {
        kind: "sectionLinks",
        heading: {
          text: "Main sections on the website",
          level: 2,
          visuallyHidden: true,
        },
        sections: [
          {
            heading: {
              text: "Journal",

              level: 3,
            },
            intro:
              "A field journal of wildlife encounters and observations from around the world.",
            link: {
              kind: "internal",
              id: "journal",
              text: "Browse journal",
            },
            icon: "icon-newspaper",
          },
          {
            heading: {
              text: "Notes",

              level: 3,
            },
            intro: "A mix of engineering notes and philosophy.",
            link: {
              kind: "internal",
              id: "notes",
              text: "Read articles",
            },
            icon: "icon-pencil",
          },
        ],
      },

      {
        kind: "homepageNoteListing",
        heading: {
          text: "Latest articles",
          level: 2,
        },
        itemCount: 3,
        emptyState: [
          {
            kind: "text",
            value:
              "Articles are coming soon — thoughts on systems, photography, and digital craft.",
          },
        ],
      },
    ],
  },
});
