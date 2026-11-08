// src/shared/resolvers/content/primitives/svg/svg.primitive.content.resolver.shared.app-init.ts

import type { SvgReferenceAuthored } from "../../../../../content-schema/assets/svg.asset.content-schema.authored.type";
import type {
  SvgAssetAppInit,
  SvgReferenceAppInit,
} from "../../../../types/assets/svg.asset.shared.app-init.type";

import type { SvgAssetId } from "../../../../types/assets/svg-id.asset.shared.type";

type Input = Readonly<{
  authored: SvgReferenceAuthored;
  registry: Readonly<Record<SvgAssetId, SvgAssetAppInit>>;
}>;

export const resolveSvgReferenceAppInit = ({
  authored,
  registry,
}: Input): SvgReferenceAppInit => {
  if (!Object.hasOwn(registry, authored.id)) {
    throw new Error(`Unknown SVG asset: ${authored.id}`);
  }

  const asset = registry[authored.id as SvgAssetId];

  return {
    id: asset.id,
    width: asset.width,
    height: asset.height,
  };
};
