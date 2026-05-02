// src/app-render-context/types/body-content.app-render-context.types.ts

import type { AppRenderContextBlockContentModule } from "@shared-types/page-content/block/app-render-context.block.page-content.types";
import type { AppRenderContextPageContentHead } from "@shared-types/page-content/site/content-head/app-render-context.content-head.page-content.types";
import type { AppRenderContextPageContentFooterModule } from "@shared-types/page-content/footer/app-render-context.page-footer.page-content.types";

export type AppRenderContextBodyContent = Readonly<{
  header: AppRenderContextPageContentHead;
  content: readonly AppRenderContextBlockContentModule[];
  footer: readonly AppRenderContextPageContentFooterModule[];
}>;
