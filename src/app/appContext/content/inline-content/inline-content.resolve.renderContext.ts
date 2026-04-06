// src/app/appContext/content/inline-content/inline-content.resolve.renderContext.ts

import type { ContentInlineResolved as AppContextInlineContent } from "@app/appContext/content/inline-content/inline-content.types";
import type { ContentInlineResolved as RenderContextInlineContent } from "@app/renderContext/content/inline-content/inline-content.types";

export const resolveInlineContentRenderContext = (
  content: readonly AppContextInlineContent[],
): readonly RenderContextInlineContent[] => {
  return content.map((item) => {
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

      case "emphasis":
        return {
          kind: "emphasis",
          content: resolveInlineContentRenderContext(item.content),
        };

      case "strong":
        return {
          kind: "strong",
          content: resolveInlineContentRenderContext(item.content),
        };

      case "code":
        return {
          kind: "code",
          value: item.value,
        };

      case "lineBreak":
        return {
          kind: "lineBreak",
        };
    }
  });
};
