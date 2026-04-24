// shared-types/page-content/inline/strong/app-render-context.strong.inline-content.page-content.types.ts

import type { AppContextStrongInlineContent } from "@shared-types/page-content/inline/strong/app-context.strong.inline-content.page-content.types";
import type { AppRenderContextInlineContent } from "@shared-types/page-content/inline/app-render-context.inline-content.page-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextStrongInlineContentRuntimeFields = Readonly<{
  content: readonly AppRenderContextInlineContent[];
}>;

export type AppRenderContextStrongInlineContent = Replace<
  AppContextStrongInlineContent,
  AppRenderContextStrongInlineContentRuntimeFields
>;
