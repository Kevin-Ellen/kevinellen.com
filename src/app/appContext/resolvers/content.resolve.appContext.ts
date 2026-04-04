// src/app/appContext/resolvers/content.resolve.appContext.ts

import type { AppState } from "@app/appState/class.appState";
import type {
  Content,
  ContentInline,
  ContentParagraph,
} from "@app/content/content.types";
import type {
  PageContent,
  PageContentInline,
  PageContentParagraph,
} from "@app/pages/content/content.page.types";

const resolveContentInlineAppContext = (
  inline: PageContentInline,
  appState: AppState,
): ContentInline => {
  switch (inline.kind) {
    case "text":
      return {
        kind: "text",
        text: inline.text,
      };

    case "external-link":
      return {
        kind: "external-link",
        label: inline.label,
        href: inline.href,
      };

    case "internal-link": {
      const page = appState.getPublicPageById(inline.pageId);

      if (!page) {
        throw new Error(`Missing content page for id: ${inline.pageId}`);
      }

      return {
        kind: "internal-link",
        pageId: inline.pageId,
        label: inline.label,
        href: page.core.slug,
      };
    }
  }
};

const resolveContentParagraphAppContext = (
  paragraph: PageContentParagraph,
  appState: AppState,
): ContentParagraph => {
  return {
    kind: "paragraph",
    inlines: paragraph.inlines.map((inline) =>
      resolveContentInlineAppContext(inline, appState),
    ),
  };
};

export const resolveContentAppContext = (
  content: PageContent,
  appState: AppState,
): Content => {
  return {
    head: content.head,
    body: content.body.map((paragraph) =>
      resolveContentParagraphAppContext(paragraph, appState),
    ),
    footer: content.footer,
  };
};
