// src/shared/resolvers/assets/svg/svg.asset.app-init.ts

import type { SvgAssetAuthored } from "../../../../content-schema/assets/svg.asset.content-schema.authored.type";
import type { SvgAssetAppInit } from "../../../types/assets/svg.asset.shared.app-init.type";
import type { SvgAssetId } from "../../../types/assets/svg-id.asset.shared.type";
import type { SvgAssetsConfigAppInit } from "../../../types/assets/svg.assets.config.app-init.type";

type Input = Readonly<{
  authored: Readonly<Record<string, SvgAssetAuthored>>;
}>;

const resolveSvgAsset = (asset: SvgAssetAuthored): SvgAssetAppInit => {
  const [, , width, height] = asset.viewBox
    .trim()
    .split(/[\s,]+/)
    .map(Number);

  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    throw new Error(`Invalid SVG viewBox: ${asset.id}`);
  }

  return {
    ...asset,
    id: asset.id as SvgAssetId,
    width,
    height,
  };
};

export const resolveSvgAssetsConfigAppInit = ({
  authored,
}: Input): SvgAssetsConfigAppInit =>
  Object.fromEntries(
    Object.entries(authored).map(([id, asset]) => [id, resolveSvgAsset(asset)]),
  );
