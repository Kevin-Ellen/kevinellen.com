// shared-types/page-content/inline/emphasis/app-render-context.emphasis.inline-content.page-content.types.ts

import type { AppContextEmphasisInlineContent } from "@shared-types/page-content/inline/emphasis/app-context.emphasis.inline-content.page-content.types";
import type { AppRenderContextInlineContent } from "@shared-types/page-content/inline/app-render-context.inline-content.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextEmphasisInlineContentRuntimeFields = Readonly<{
  content: readonly AppRenderContextInlineContent[];
}>;

export type AppRenderContextEmphasisInlineContent = Replace<
  AppContextEmphasisInlineContent,
  AppRenderContextEmphasisInlineContentRuntimeFields
>;
