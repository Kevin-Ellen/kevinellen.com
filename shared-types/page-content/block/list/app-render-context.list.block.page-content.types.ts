// shared-types/page-content/block/list/app-render-context.list.block.page-content.types.ts

import type {
  AppContextListItemBlockContentModule,
  AppContextListBlockContentModule,
} from "@shared-types/page-content/block/list/app-context.list.block.page-content.types";
import type { AppRenderContextInlineContent } from "@shared-types/page-content/inline/app-render-context.inline-content.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextListItemBlockContentModuleRuntimeFields = Readonly<{
  content: readonly AppRenderContextInlineContent[];
}>;

export type AppRenderContextListItemBlockContentModule = Replace<
  AppContextListItemBlockContentModule,
  AppRenderContextListItemBlockContentModuleRuntimeFields
>;

type AppRenderContextListBlockContentModuleRuntimeFields = Readonly<{
  items: readonly AppRenderContextListItemBlockContentModule[];
}>;

export type AppRenderContextListBlockContentModule = Replace<
  AppContextListBlockContentModule,
  AppRenderContextListBlockContentModuleRuntimeFields
>;

export type AppRenderContextListModuleItem =
  AppRenderContextListBlockContentModule["items"][number];

export type AppRenderContextListInlineItem =
  AppRenderContextListItemBlockContentModule["content"][number];
