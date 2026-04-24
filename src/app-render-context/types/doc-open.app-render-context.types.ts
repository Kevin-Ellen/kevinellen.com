// src/app-render-context/types/doc-open.app-render-context.types.ts

import type { PageMetadata } from "@shared-types/page-definitions/shared/shared.metadata.page-definition.types";
import type { SiteLanguage } from "@shared-types/language/language.types";
import type { AppRenderContextThemeColour } from "@shared-types/config/webmanifest/app-render-context.theme-colour.webmanifest.types";
import type {
  AppRenderContextInlineScript,
  AppRenderContextLinkScript,
} from "@shared-types/assets/scripts/app-render-context.scripts.assets.types";
import type { AppRenderContextHeadLinkAsset } from "@shared-types/config/site-config/app-render-context.head-assets.config.types";
import type { AppRenderContextPreload } from "@shared-types/config/site-config/app-render-context.preload.config.types";

export type AppRenderContextDocOpen = Readonly<{
  metadata: PageMetadata;
  language: SiteLanguage;
  canonicalUrl: string | null;
  inlineScripts: readonly AppRenderContextInlineScript[];
  linkScripts: readonly AppRenderContextLinkScript[];
  preload: AppRenderContextPreload;
  links: readonly AppRenderContextHeadLinkAsset[];
  nonce: string;
  themeColour: AppRenderContextThemeColour;
}>;
