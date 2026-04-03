// src/app/appContext/resolvers/content.resolve.appContext.ts

import type {
  AppContextContent,
  AppContextContentInline,
  AppContextContentParagraph,
} from "@app/appContext/appContext.types";
import type { AppState } from "@app/appState/class.appState";
import type {
  PageContent,
  PageContentInline,
  PageContentParagraph,
} from "@app/pages/page.content.types";

const resolveContentInlineAppContext = (
  inline: PageContentInline,
  appState: AppState,
): AppContextContentInline => {
  if (inline.kind === "text") {
    return {
      kind: "text",
      text: inline.text,
    };
  }

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
};

const resolveContentParagraphAppContext = (
  paragraph: PageContentParagraph,
  appState: AppState,
): AppContextContentParagraph => {
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
): AppContextContent => {
  return {
    head: content.head,
    body: content.body.map((paragraph) =>
      resolveContentParagraphAppContext(paragraph, appState),
    ),
    footer: content.footer,
  };
};
