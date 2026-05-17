// src/app-render-context/resolve/body-content/inline/strong.resolve.app-render-context.ts

import type { AppContext } from "@app-context/class.app-context";
import type { AppContextStrongInline } from "@shared-types/page-content/inline/strong/app-context.strong.inline-content.types";
import type { AppRenderContextStrongInline } from "@shared-types/page-content/inline/strong/app-render-context.strong.inline-content.types";

import { appRenderContextResolveInline } from "@app-render-context/resolve/body-content/inline/inline.resolve.app-render-context";

export const appRenderContextResolveStrongInline = (
  appContext: AppContext,
  inline: AppContextStrongInline,
): AppRenderContextStrongInline => ({
  ...inline,
  content: inline.content.map((item) =>
    appRenderContextResolveInline(appContext, item),
  ),
});
