// src/rendering/body-content/body-content.renderer.ts

import type { AppRenderContextBodyContent } from "@app-render-context/types/body-content.app-render-context.types";

import { renderBodyContentHeader } from "@rendering/body-content/header.body-content.renderer";
import { renderBodyContentModule } from "@rendering/body-content/module.body-content.renderer";
import { renderBodyContentFooter } from "@rendering/body-content/footer/footer.body-content.renderer";

export const renderBodyContent = (
  bodyContent: AppRenderContextBodyContent,
): string => {
  const contentModules = bodyContent.content
    .map(renderBodyContentModule)
    .join("");

  return `<main class="l-main">
    <div class="l-page__frame">
      ${renderBodyContentHeader(bodyContent.header)}
      ${contentModules}
      ${renderBodyContentFooter(bodyContent.footer)}
    </div>
  </main>`;
};
