// src/app/assets/scripts/authored/header-headroom.script.js

const initHeader = () => {
  const header = document.querySelector(".l-header");

  if (!header) return;

  const movementThreshold = 16;
  const topThreshold = 120;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  let previousY = Math.max(0, window.scrollY);
  let previousDirection = 0;
  let distance = 0;
  let ticking = false;

  const resetHeader = () => {
    header.classList.remove(
      "l-header--floating",
      "l-header--hidden",
      "l-header--returning",
    );
  };

  const update = () => {
    const currentY = Math.max(0, window.scrollY);
    const delta = currentY - previousY;
    const direction = Math.sign(delta);

    previousY = currentY;

    // Restore the original header near the top.
    if (currentY <= topThreshold) {
      previousDirection = 0;
      distance = 0;

      if (!header.classList.contains("l-header--floating")) {
        return;
      }

      if (reduceMotion.matches) {
        resetHeader();
        return;
      }

      header.classList.add("l-header--returning");
      return;
    }

    // Cancel the return transition if scrolling away.
    if (header.classList.contains("l-header--returning")) {
      header.classList.remove("l-header--returning");
    }

    if (direction === 0) return;

    if (direction !== previousDirection) {
      previousDirection = direction;
      distance = 0;
    }

    distance += Math.abs(delta);

    if (distance < movementThreshold) return;

    if (direction < 0) {
      header.classList.add("l-header--floating");
      header.classList.remove("l-header--hidden");
    } else if (header.classList.contains("l-header--floating")) {
      header.classList.add("l-header--hidden");
    }

    distance = 0;
  };

  // Restore the original presentation after fading out.
  header.addEventListener("transitionend", (event) => {
    if (
      event.target === header &&
      event.propertyName === "opacity" &&
      header.classList.contains("l-header--returning")
    ) {
      resetHeader();
    }
  });

  const onScroll = () => {
    if (ticking) return;

    ticking = true;

    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  // Handle browser scroll restoration.
  if (previousY > topThreshold) {
    header.classList.add("l-header--floating", "l-header--hidden");
  }
};

initHeader();
