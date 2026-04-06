// src/app/renderContext/content/modules/paragraph/paragraph.resolve.renderContext.ts

import type { AppContextParagraphModule } from "@app/appContext/content/content.appContext.types";
import type { RenderContextParagraphModule } from "@app/renderContext/content/content.renderContext.types";

export const resolveParagraphRenderContext = (
  module: AppContextParagraphModule,
): RenderContextParagraphModule => {
  return {
    kind: "paragraph",
    content: module.content.map((item) => {
      switch (item.kind) {
        case "text":
          return {
            kind: "text",
            value: item.value,
          };

        case "link":
          return {
            kind: "link",
            text: item.text,
            href: item.href,
            isExternal: item.isExternal,
          };
      }
    }),
  };
};
