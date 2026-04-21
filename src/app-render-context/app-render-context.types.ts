// src/app-render-context/app-render-context.types.ts

import type { PageMetadata } from "@shared-types/pages/shared/metadata.shared.page.types";
import type { AppStatePageRobotsDirectives } from "@shared-types/pages/shared/app-state.robots.shared.page.types";
import type { SiteLanguage } from "@shared-types/language/language.types";
import type {
  AppRenderContextDocOpenAssets,
  AppRenderContextDocCloseAssets,
} from "@shared-types/pages/shared/assets/app-render-context.assets.shared.page.types";
import type { AppRenderContextThemeColour } from "@shared-types/config/webmanifest/app-render-context.theme-colour.webmanifest.types";

export type AppRenderContextResponsePolicy = Readonly<{
  robots: AppStatePageRobotsDirectives | null;
  nonce: string;
}>;

export type AppRenderContextDocOpen = Readonly<{
  metadata: PageMetadata | null;
  language: SiteLanguage;
  canonicalUrl: string | null;
  assets: AppRenderContextDocOpenAssets;
  nonce: string;
  themeColour: AppRenderContextThemeColour;
}>;

export type AppRenderContextDocClose = Readonly<{
  assets: AppRenderContextDocCloseAssets;
}>;

export type AppRenderContextData = Readonly<{
  responsePolicy: AppRenderContextResponsePolicy;
  docOpen: AppRenderContextDocOpen;
  docClose: AppRenderContextDocClose;
}>;
