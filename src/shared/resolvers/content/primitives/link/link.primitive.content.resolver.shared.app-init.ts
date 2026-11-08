// src/shared/resolvers/content/primitives/link/link.primitive.content.resolver.shared.app-init.ts

import type {
  LinkAuthored,
  InternalLinkAuthored,
} from "../../../../../content-schema/primitives/link.primitive.content-schema.authored.type";

import type {
  LinkAppInit,
  LinkCommonAppInit,
  InternalLinkAppInit,
  ExternalLinkAppInit,
} from "../../../../types/content/primitives/link.primitive.content.shared.app-init.type";

import type { SvgAssetAppInit } from "../../../../types/assets/svg.asset.shared.app-init.type";
import type { SvgAssetId } from "../../../../types/assets/svg-id.asset.shared.type";

import { resolveSvgReferenceAppInit } from "../svg/svg.primitive.content.resolver.shared.app-init";

type Input<T extends LinkAuthored> = Readonly<{
  authored: T;
  svgAssets: Readonly<Record<SvgAssetId, SvgAssetAppInit>>;
  socialProfiles: Readonly<Record<string, string>>;
}>;

type ResolvedLink<T extends LinkAuthored> = T extends InternalLinkAuthored
  ? InternalLinkAppInit
  : ExternalLinkAppInit;

const resolveCommon = ({
  authored,
  svgAssets,
}: Pick<Input<LinkAuthored>, "authored" | "svgAssets">): LinkCommonAppInit => ({
  label: authored.label ?? null,
  ariaLabel: authored.ariaLabel ?? null,
  title: authored.title ?? null,
  icon: authored.icon
    ? resolveSvgReferenceAppInit({
        authored: authored.icon,
        registry: svgAssets,
      })
    : null,
  variant: authored.variant ?? null,
  target: authored.target ?? null,
  rel: authored.rel ?? null,
});

export const resolveLinkAppInit = <T extends LinkAuthored>({
  authored,
  svgAssets,
  socialProfiles,
}: Input<T>): ResolvedLink<T> => {
  const common = resolveCommon({ authored, svgAssets });

  let resolved: LinkAppInit;

  if (authored.kind === "internal") {
    resolved = {
      ...common,
      kind: "internal",
      pageId: authored.pageId,
    };
  } else if (authored.kind === "social") {
    const href = socialProfiles[authored.profile];

    if (!href) {
      throw new Error(`Unknown social profile: ${authored.profile}`);
    }

    resolved = {
      ...common,
      kind: "external",
      href,
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    };
  } else {
    resolved = {
      ...common,
      kind: "external",
      href: authored.href,
      target: "_blank",
      rel: ["noopener"],
    };
  }

  return resolved as ResolvedLink<T>;
};
