// src/app-context/resolve/page-content/content.resolve.app-context.ts

import type { AppStatePageContent } from "@shared-types/page-content/app-state.page-content.types";
import type { AppContextPageContent } from "@shared-types/page-content/app-context.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolvePageContentHead } from "@app-context/resolve/page-content/head/content-head.resolve.app-context";
import { appContextResolveBlock } from "@app-context/resolve/page-content/block/block.resolve.app-context";
import { appContextResolveFooter } from "@app-context/resolve/page-content/footer/footer.resolve.app-context";

export const appContextResolvePageContent = (
  content: AppStatePageContent,
  context: AppContextPageContentResolverContext,
): AppContextPageContent => {
  return {
    ...content,
    head: appContextResolvePageContentHead(content.head, context),
    content: content.content.map((module) =>
      appContextResolveBlock(module, context),
    ),
    footer: content.footer.map((module) =>
      appContextResolveFooter(module, context),
    ),
  };
};
