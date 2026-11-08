// src/tools/authored-content-generator/validate/app-init/app-init.validate.ts

import type { ContentAuthored } from "../../../../content-schema/content/content.content-schema.authored.type";
import type { ScriptAssetId } from "../../../../shared/types/assets/script-id.asset.shared.type";
import type { ContentAppInit } from "../../../../shared/types/content/content.shared.app-init.type";
import type { PhotoAssetAuthored } from "../../../../content-schema/assets/photo/photo.asset.content-schema.authored.type";
import type { PhotoAppInit } from "../../../../shared/types/assets/photo.asset.shared.app-init.type";

import { resolveContentAppInit } from "../../../../shared/resolvers/content/content.resolver.shared.app-init";
import { resolveAssetConfigAppInit } from "../../../../shared/resolvers/assets/asset.resolver.shared.app-init";
import { resolveTopicsConfigAppInit } from "../../../../shared/resolvers/content/topics/topics.resolve.shared.app-init";
import { resolvePhotoAppInit } from "../../../../shared/resolvers/assets/photo/photo.asset.resolver.shared.app-init";

import { personConfigAuthored } from "../../../../shared/config/person.config.shared.authored";
import { topicsConfigAuthored } from "../../../../shared/config/topics.config.shared.app-state";

export const validateContentAppInit = (
  authored: ContentAuthored,
): ContentAppInit => {
  const assets = resolveAssetConfigAppInit();

  const topics = resolveTopicsConfigAppInit({
    authored: topicsConfigAuthored,
  });

  return resolveContentAppInit({
    authored,
    svgAssets: assets.svg,
    socialProfiles: personConfigAuthored.socialProfiles,
    scriptIds: Object.keys(assets.scripts.registry) as ScriptAssetId[],
    topics,
  });
};

export const validatePhotoAppInit = (
  authored: PhotoAssetAuthored,
): PhotoAppInit => resolvePhotoAppInit(authored);
