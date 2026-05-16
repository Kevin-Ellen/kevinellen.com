// src/assets/scripts/authored/header-condense.script.js

(() => {
  const header = document.querySelector(".l-header");
  const sentinel = document.querySelector(".l-header-sentinel");

  if (!header || !sentinel) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle("is-condensed", !entry.isIntersecting);
    },
    { threshold: 0 },
  );

  observer.observe(sentinel);
})();
