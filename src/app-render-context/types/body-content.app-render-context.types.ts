// src/app-render-context/types/body-content.app-render-context.types.ts

import type { AppRenderContextBlockContentModule } from "@shared-types/page-content/block/app-render-context.block.types";
import type { AppRenderContextPageContentHead } from "@shared-types/page-content/site/content-head/app-render-context.content-head.types";
import type { AppRenderContextPageContentFooterModule } from "@shared-types/page-content/footer/app-render-context.page-footer.types";

export type AppRenderContextBodyContent = Readonly<{
  header: AppRenderContextPageContentHead;
  content: readonly AppRenderContextBlockContentModule[];
  footer: readonly AppRenderContextPageContentFooterModule[];
}>;
