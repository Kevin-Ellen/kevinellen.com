// src/app/assets/global.scripts.assets.ts

import type { ScriptAsset } from "@src/app/assets/scripts/scripts.assets.types";

export const appScripts: ScriptAsset[] = [
  {
    id: "header-condense",
    kind: "inline",
    content: `
(() => {
  const header = document.querySelector(".l-header");
  const sentinel = document.querySelector(".l-header-sentinel");

  if (!header || !sentinel) return;

  let observer;
  const triggerRatio = 1 / 3;

  const initObserver = () => {
    if (observer) observer.disconnect();

    const headerHeight = header.getBoundingClientRect().height;
    const triggerOffset = headerHeight * triggerRatio;

    observer = new IntersectionObserver(
      ([entry]) => {
        header.classList.toggle("is-condensed", !entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: \`-\${triggerOffset}px 0px 0px 0px\`,
      }
    );

    observer.observe(sentinel);
  };

  initObserver();
  window.addEventListener("resize", initObserver);
})();
    `,
    location: "footer",
  },
];
