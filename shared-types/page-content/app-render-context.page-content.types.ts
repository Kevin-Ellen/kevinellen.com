// shared-types/page-content/app-render-context.page-content.types.ts

import type { AppContextPageContent } from "@shared-types/page-content/app-context.page-content.types";
import type { AppRenderContextPageContentHead } from "@shared-types/page-content/site/content-head/app-render-context.content-head.types";
import type { AppRenderContextBlock } from "@shared-types/page-content/block/app-render-context.block.types";
import type { AppRenderContextPageContentFooter } from "@shared-types/page-content/footer/app-render-context.page-footer.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type RuntimeFields = Readonly<{
  head: AppRenderContextPageContentHead;
  content: readonly AppRenderContextBlock[];
  footer: readonly AppRenderContextPageContentFooter[];
}>;

export type AppRenderContextPageContent = Replace<
  AppContextPageContent,
  RuntimeFields
>;
