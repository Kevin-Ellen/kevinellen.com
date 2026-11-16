// src/app/assets/scripts/authored/photo-viewer.script.js


const initialisePhotoViewers = () => {
  document.querySelectorAll("[data-photo-expand]").forEach((trigger) => {
    if (trigger.tagName !== "BUTTON") {
      return;
    }

    const dialogId = trigger.getAttribute("aria-controls");

    if (!dialogId) {
      return;
    }

    const dialog = document.getElementById(dialogId);

    if (!dialog || dialog.tagName !== "DIALOG") {
      return;
    }

    const closeButton = dialog.querySelector("[data-photo-close]");
    const image = dialog.querySelector("[data-photo-viewer-src]");
    const viewerSrc = image?.getAttribute("data-photo-viewer-src");

    const loadViewerImage = () => {
      if (image && viewerSrc && !image.hasAttribute("src")) {
        image.setAttribute("src", viewerSrc);
      }
    };

    // Begin loading before activation whenever possible.
    trigger.addEventListener("pointerenter", loadViewerImage);
    trigger.addEventListener("focus", loadViewerImage);
    trigger.addEventListener("pointerdown", loadViewerImage);

    trigger.addEventListener("click", () => {
      if (dialog.open) {
        return;
      }

      loadViewerImage();
      dialog.showModal();
    });

    closeButton?.addEventListener("click", () => {
      dialog.close();
    });

    dialog.addEventListener("close", () => {
      trigger.focus();
    });

    dialog.addEventListener("click", (event) => {
      if (
        event.target?.closest?.(
          "button, [popover], .c-photo__viewer-details",
        )
      ) {
        return;
      }

      dialog.close();
    });
  });
};

initialisePhotoViewers();
