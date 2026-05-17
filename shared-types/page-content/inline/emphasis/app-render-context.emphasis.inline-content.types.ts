// shared-types/page-content/inline/emphasis/app-render-context.emphasis.inline-content.types.ts

import type { AppContextEmphasisInline } from "@shared-types/page-content/inline/emphasis/app-context.emphasis.inline-content.types";
import type { AppRenderContextInline } from "@shared-types/page-content/inline/app-render-context.inline-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type RuntimeFields = Readonly<{
  content: readonly AppRenderContextInline[];
}>;

export type AppRenderContextEmphasisInline = Replace<
  AppContextEmphasisInline,
  RuntimeFields
>;
