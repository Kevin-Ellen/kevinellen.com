// src/config/scripts.assets.config.ts

import type { ScriptAssetAuthored } from "@shared-types/assets/script.asset.authored.types";

export const appScripts: readonly ScriptAssetAuthored[] = [
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
