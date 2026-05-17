// shared-types/page-content/inline/strong/app-render-context.strong.inline-content.types.ts

import type { AppContextStrongInline } from "@shared-types/page-content/inline/strong/app-context.strong.inline-content.types";
import type { AppRenderContextInline } from "@shared-types/page-content/inline/app-render-context.inline-content.types";

import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type RuntimeFields = Readonly<{
  content: readonly AppRenderContextInline[];
}>;

export type AppRenderContextStrongInline = Replace<
  AppContextStrongInline,
  RuntimeFields
>;
