// shared-types/page-content/app-render-context.page-content.types.ts

import type { AppContextPageContent } from "@shared-types/page-content/app-context.page-content.types";
import type { AppRenderContextPageContentHead } from "@shared-types/page-content/site/content-head/app-render-context.content-head.page-content.types";
import type { AppRenderContextBlockContentModule } from "@shared-types/page-content/block/app-render-context.block.page-content.types";
import type { AppRenderContextPageContentFooterModule } from "@shared-types/page-content/footer/app-render-context.page-footer.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextPageContentRuntimeFields = Readonly<{
  header: AppRenderContextPageContentHead;
  content: readonly AppRenderContextBlockContentModule[];
  footer: readonly AppRenderContextPageContentFooterModule[];
}>;

export type AppRenderContextPageContent = Replace<
  AppContextPageContent,
  AppRenderContextPageContentRuntimeFields
>;

export type AppRenderContextPageContentModule =
  AppRenderContextPageContent["content"][number];

export type AppRenderContextPageFooterModule =
  AppRenderContextPageContent["footer"][number];
