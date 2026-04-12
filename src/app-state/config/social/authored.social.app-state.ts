// src/app-state/config/social/authored.social.app-state.ts

import type { AuthoredSocial } from "@shared-types/config/social/authored.social.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const authoredSocial: AuthoredSocial = deepFreeze({
  github: {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Kevin-Ellen",
    svgId: "icon-github",
  },
  instagram: {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/photography.mallard",
    svgId: "icon-instagram",
  },
  linkedin: {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kevinellen/",
    svgId: "icon-linkedin",
  },
});
