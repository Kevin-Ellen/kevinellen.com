// src/app/appContext/resolvers/inline-content.resolve.appContext.ts

import type { ContentInlineAuthored } from "@shared-types/content/inline-content/inline-content.types";
import type { ContentInlineResolved } from "@app/appContext/content/inline-content/inline-content.types";
import type { AppState } from "@app/appState/class.appState";

export const resolveInlineContentAppContext = (
  content: readonly ContentInlineAuthored[],
  appState: AppState,
): readonly ContentInlineResolved[] => {
  return content.map((item) => {
    switch (item.kind) {
      case "text":
        return {
          kind: "text",
          value: item.value,
        };

      case "internalLink": {
        const page = appState.getPublicPageById(item.pageId);

        if (!page) {
          throw new Error(
            `resolveInlineContentAppContext: could not resolve internal link page id "${item.pageId}"`,
          );
        }

        return {
          kind: "link",
          text: item.text,
          href: page.core.slug,
          isExternal: false,
        };
      }

      case "externalLink":
        return {
          kind: "link",
          text: item.text,
          href: item.href,
          isExternal: true,
        };

      case "emphasis":
        return {
          kind: "emphasis",
          content: resolveInlineContentAppContext(item.content, appState),
        };

      case "strong":
        return {
          kind: "strong",
          content: resolveInlineContentAppContext(item.content, appState),
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
