// src/config/social.config.ts

import type { SocialConfig } from "@config/social.config.types";
import { deepFreeze } from "@utils/deepFreeze.util";

export const socialConfig: SocialConfig = deepFreeze({
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
