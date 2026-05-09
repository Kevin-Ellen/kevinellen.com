// src/app-render-context/types/body-content.app-render-context.types.ts

import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";
import type { AppRenderContextPageContentHead } from "@shared-types/page-content/site/content-head/app-render-context.content-head.types";
import type { AppRenderContextPageContentFooter } from "@shared-types/page-content/footer/app-render-context.page-footer.types";

export type AppRenderContextBodyContent = Readonly<{
  header: AppRenderContextPageContentHead | null;
  content: readonly AppRenderContextBlock[];
  footer: readonly AppRenderContextPageContentFooter[];
}>;
