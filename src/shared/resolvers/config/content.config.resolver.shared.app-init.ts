// src/shared/resolvers/config/content.config.resolver.shared.app-init.ts

import type { ContentAuthored } from "../../../content-schema/content/content.content-schema.authored.type";
import type { ContentAppInit } from "../../types/content/content.shared.app-init.type";
import type { SvgAssetsConfigAppInit } from "../../types/assets/svg.assets.config.app-init.type";
import type { PersonConfigAppInit } from "../../types/config/person.config.shared.app-init.type";
import type { ScriptAssetId } from "../../types/assets/script-id.asset.shared.type";
import type { TopicsConfigAppInit } from "../../../app/types/config/topics/topics.config.app-init.type";

import { resolveContentAppInit } from "../content/content.resolver.shared.app-init";

export type ContentConfigAppInit = Readonly<{
  bySlug: Readonly<Record<string, ContentAppInit>>;
  errorsByStatus: Readonly<Record<number, ContentAppInit>>;
}>;

type Input = Readonly<{
  authored: readonly ContentAuthored[];
  svgAssets: SvgAssetsConfigAppInit;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
  scriptIds: readonly ScriptAssetId[];
  topics: TopicsConfigAppInit;
}>;

export const resolveContentConfigAppInit = ({
  authored,
  svgAssets,
  socialProfiles,
  scriptIds,
  topics,
}: Input): ContentConfigAppInit => {
  const bySlug: Record<string, ContentAppInit> = {};
  const errorsByStatus: Record<number, ContentAppInit> = {};
  const ids = new Set<string>();

  for (const entry of authored) {
    if (ids.has(entry.id)) {
      throw new Error(`Duplicate content ID: ${entry.id}`);
    }

    ids.add(entry.id);

    const resolved = resolveContentAppInit({
      authored: entry,
      svgAssets,
      socialProfiles,
      scriptIds,
      topics,
    });

    if (entry.kind === "public") {
      if (Object.hasOwn(bySlug, entry.slug)) {
        throw new Error(`Duplicate content slug: ${entry.slug}`);
      }

      bySlug[entry.slug] = resolved;
      continue;
    }

    if (Object.hasOwn(errorsByStatus, resolved.status)) {
      throw new Error(`Duplicate error status: ${resolved.status}`);
    }

    errorsByStatus[resolved.status] = resolved;
  }

  return {
    bySlug,
    errorsByStatus,
  };
};
