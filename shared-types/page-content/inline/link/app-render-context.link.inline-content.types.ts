// shared-types/page-content/inline/link/app-render-context.link.inline-content.types.ts

import type { AppRenderContextLink } from "@shared-types/links/app-render-context.links.types";

export type AppRenderContextLinkInline = Readonly<{
  kind: "link";
  link: AppRenderContextLink;
}>;
