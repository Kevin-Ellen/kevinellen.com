// src/app-context/resolve/page/content/content.page.resolve.app-context.ts

import type { AppStatePageContent } from "@shared-types/page-content/app-state.page-content.types";
import type { AppContextPageContent } from "@shared-types/page-content/app-context.page-content.types";

import type { AppContextPageContentResolverContext } from "@app-context/resolve/types/context.page-content.resolve.app-context.types";

import { appContextResolvePageContentHead } from "@app-context/resolve/page/content/head/content-head.page.resolve.app-context";
import { appContextResolveBlockContentModule } from "@app-context/resolve/page/content/block/block.page-content.resolve.app-context";

export const appContextResolvePageContent = (
  content: AppStatePageContent,
  context: AppContextPageContentResolverContext,
): AppContextPageContent => {
  return {
    ...content,
    head: appContextResolvePageContentHead(content.head, context),
    body: content.body.map((module) =>
      appContextResolveBlockContentModule(module, context),
    ),
    footer: content.footer.map((module) =>
      appContextResolveBlockContentModule(module, context),
    ),
  };
};
