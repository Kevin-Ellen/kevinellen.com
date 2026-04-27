// src/rendering/body-content/footer.body-content.renderer.ts

import type { AppRenderContextBodyContent } from "@app-render-context/types/body-content.app-render-context.types";

import { renderBodyContentModule } from "@rendering/body-content/module.body-content.renderer";

type Footer = AppRenderContextBodyContent["footer"];

export const renderBodyContentFooter = (footer: Footer): string => {
  if (!footer.length) {
    return "";
  }

  return `<footer class="m-pageFooter">
    ${footer.map(renderBodyContentModule).join("")}
  </footer>`;
};
