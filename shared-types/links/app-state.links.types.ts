// shared-types/links/app-state.links.types.ts

import type {
  AuthoredExternalLink,
  AuthoredInternalLink,
  AuthoredSocialLink,
} from "@shared-types/links/authored.links.types";
import type { SvgAssetId } from "@shared-types/assets/svg/id.svg.assets.types";
import type { LinkOpenBehaviour } from "@shared-types/links/shared.links.types";
import type { Replace } from "@shared-types/shared-types-utils/replace.shared.types";

type AppStateLinkDeterministicFields = Readonly<{
  svgId: SvgAssetId | null;
  behaviour: LinkOpenBehaviour;
}>;

export type AppStateInternalLink = Replace<
  AuthoredInternalLink,
  AppStateLinkDeterministicFields
>;

export type AppStateSocialLink = Replace<
  AuthoredSocialLink,
  AppStateLinkDeterministicFields
>;

export type AppStateExternalLink = Replace<
  AuthoredExternalLink,
  AppStateLinkDeterministicFields
>;

export type AppStateLink =
  | AppStateInternalLink
  | AppStateSocialLink
  | AppStateExternalLink;
