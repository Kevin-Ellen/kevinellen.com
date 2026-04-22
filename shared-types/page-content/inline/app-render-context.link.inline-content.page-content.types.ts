// shared-types/page-content/inline/app-render-context.link.inline-content.page-content.types.ts

import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";

export type AppRenderContextLinkInlineContent = Readonly<{
  kind: "link";
  link: AppRenderContextLink;
}>;
