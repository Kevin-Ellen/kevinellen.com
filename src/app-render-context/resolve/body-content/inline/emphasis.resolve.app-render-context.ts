// src/app-render-context/resolve/body-content/inline/emphasis.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextEmphasisInline } from "@shared-types/page-content/inline/emphasis/app-context.emphasis.inline-content.types";
import type { AppRenderContextEmphasisInline } from "@shared-types/page-content/inline/emphasis/app-render-context.emphasis.inline-content.types";

import { appRenderContextResolveInline } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

export const appRenderContextResolveEmphasisInline = (
  appContext: AppContext,
  inline: AppContextEmphasisInline,
): AppRenderContextEmphasisInline => ({
  ...inline,
  content: inline.content.map((item) =>
    appRenderContextResolveInline(appContext, item),
  ),
});
