// src/rendering/body-content/body-content.renderer.ts

import type { AppRenderContextBodyContent } from "@app-render-context/types/body-content.app-render-context.types";

export const renderBodyContent = (
  bodyContent: AppRenderContextBodyContent,
): string => {
  return `<main>
    <h1>Debug Body Content</h1>
    <pre>
      ${JSON.stringify(bodyContent, null, 2)}
    </pre>
  </main>`;
};
