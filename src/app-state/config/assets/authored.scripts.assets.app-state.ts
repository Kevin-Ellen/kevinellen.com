// src/app-state/config/assets/authored.scripts.assets.app-state.ts

import type { AuthoredScriptAssets } from "@shared-types/assets/scripts/authored.scripts.assets.types";

export const AUTHORED_SCRIPT_ASSETS: AuthoredScriptAssets = [
  {
    id: "header-condense",
    kind: "inline",
    content: `
(() => {
  const header = document.querySelector(".l-header");
  const sentinel = document.querySelector(".l-header-sentinel");

  if (!header || !sentinel) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle("is-condensed", !entry.isIntersecting);
    },
    {
      threshold: 0,
    }
  );

  observer.observe(sentinel);
})();
    `,
    location: "footer",
  },
];
