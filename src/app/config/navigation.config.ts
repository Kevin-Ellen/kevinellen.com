// src/app/config/navigation.config.ts

import type { NavigationConfigAuthored } from "../types/config/navigation/navigation.config.authored.type";

export const navigationConfigAuthored = {
  branding: {
    kind: "internal",
    pageId: "home",
    label: "Kevin Ellen",
    ariaLabel: "Kevin Ellen — Home",
    icon: {
      id: "logo-monogram-ke",
    },
  },

  primary: [
    { kind: "internal", pageId: "journal" },
    { kind: "internal", pageId: "topics" },
    { kind: "internal", pageId: "about" },
  ],

  social: [
    {
      kind: "social",
      profile: "instagram",
      label: "Instagram",
      ariaLabel: "Instagram",
      icon: {
        id: "icon-instagram",
      },
      target: "_blank",
      rel: ["noreferrer", "noopener"],
    },
  ],

  footer: {
    primary: [
      {
        id: "site",
        label: "Site",
        links: [
          { kind: "internal", pageId: "home" },
          { kind: "internal", pageId: "journal" },
          { kind: "internal", pageId: "topics" },
          { kind: "internal", pageId: "about" },
        ],
      },
      {
        id: "discover",
        label: "Discover",
        links: [
          { kind: "internal", pageId: "topic-essex" },
          { kind: "internal", pageId: "topic-raptors" },
          { kind: "internal", pageId: "topic-nature-reserves" },
          { kind: "internal", pageId: "topic-travel" },
        ],
      },
      {
        id: "elsewhere",
        label: "Elsewhere",
        links: [
          {
            kind: "social",
            profile: "instagram",
            label: "Instagram",
            target: "_blank",
            rel: ["noreferrer", "noopener"],
          },
        ],
      },
    ],

    legal: {
      id: "legal",
      label: "Legal",
      links: [
        { kind: "internal", pageId: "privacy" },
        { kind: "internal", pageId: "terms" },
        { kind: "internal", pageId: "licensing" },
      ],
    },
  },
} as const satisfies NavigationConfigAuthored;
