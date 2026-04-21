// shared-types/links/app-context.links.types.ts

import type {
  AppStateExternalLink,
  AppStateInternalLink,
  AppStateSocialLink,
} from "@shared-types/links/app-state.links.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextInternalLinkFields = Readonly<{
  href: string;
  text: string;
}>;

type AppContextSocialLinkFields = Readonly<{
  href: string;
  text: string;
}>;

type AppContextExternalLinkFields = Readonly<{}>;

export type AppContextInternalLink = Replace<
  AppStateInternalLink,
  AppContextInternalLinkFields
>;

export type AppContextSocialLink = Replace<
  AppStateSocialLink,
  AppContextSocialLinkFields
>;

export type AppContextExternalLink = Replace<
  AppStateExternalLink,
  AppContextExternalLinkFields
>;

export type AppContextLink =
  | AppContextInternalLink
  | AppContextSocialLink
  | AppContextExternalLink;
