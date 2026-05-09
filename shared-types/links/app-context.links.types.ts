// shared-types/links/app-context.links.types.ts

import type {
  AppStateExternalLink,
  AppStateInternalLink,
} from "@shared-types/links/app-state.links.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppContextInternalLinkFields = Readonly<{
  href: string;
  text: string;
}>;

export type AppContextInternalLink = Replace<
  AppStateInternalLink,
  AppContextInternalLinkFields
>;

export type AppContextExternalLink = AppStateExternalLink;

export type AppContextLink = AppContextInternalLink | AppContextExternalLink;
