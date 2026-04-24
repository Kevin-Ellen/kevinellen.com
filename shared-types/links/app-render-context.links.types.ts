// shared-types/links/app-render-context.links.types.ts

import type {
  AppContextExternalLink,
  AppContextInternalLink,
  AppContextSocialLink,
} from "@shared-types/links/app-context.links.types";
import type { AppRenderContextSvgReference } from "@shared-types/assets/svg/app-render-context.svg.assets.types";
import type { ReplaceAndOmit } from "@shared-types/shared-types-utils/replace.shared.types";

type AppRenderContextLinkFields = Readonly<{
  openInNewTab: boolean;
  svg: AppRenderContextSvgReference | null;
}>;

export type AppRenderContextInternalLink = ReplaceAndOmit<
  AppContextInternalLink,
  AppRenderContextLinkFields,
  "id" | "svgId" | "behaviour"
>;

export type AppRenderContextSocialLink = ReplaceAndOmit<
  AppContextSocialLink,
  AppRenderContextLinkFields,
  "id" | "svgId" | "behaviour"
>;

export type AppRenderContextExternalLink = ReplaceAndOmit<
  AppContextExternalLink,
  AppRenderContextLinkFields,
  "svgId" | "behaviour"
>;

export type AppRenderContextLink =
  | AppRenderContextInternalLink
  | AppRenderContextSocialLink
  | AppRenderContextExternalLink;
