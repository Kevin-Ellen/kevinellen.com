// src/shared/resolvers/content/content.resolver.shared.app-init.ts

import type {
  ContentAuthored,
  PagePresentationAuthored,
} from "../../../content-schema/content/content.content-schema.authored.type";
import type { ContentAppInit } from "../../types/content/content.shared.app-init.type";
import type { SvgAssetsConfigAppInit } from "../../types/assets/svg.assets.config.app-init.type";
import type { PersonConfigAppInit } from "../../types/config/person.config.shared.app-init.type";
import type { ScriptAssetId } from "../../types/assets/script-id.asset.shared.type";
import type { TopicsConfigAppInit } from "../../../app/types/config/topics/topics.config.app-init.type";

import { resolveContentBodyAppInit } from "./body/body.content.resolver.shared.app-init";
import { resolveStructuredDataAppInit } from "./structured-data/structured-data.content.resolver.shared.app-init";

type Input = Readonly<{
  authored: ContentAuthored;
  svgAssets: SvgAssetsConfigAppInit;
  socialProfiles: PersonConfigAppInit["socialProfiles"];
  scriptIds: readonly ScriptAssetId[];
  topics: TopicsConfigAppInit;
}>;

const defaultPagePresentation: PagePresentationAuthored = {
  layout: "contained",
  header: {
    appearance: "solid",
    colourScheme: "default",
  },
};

export const resolveContentAppInit = ({
  authored,
  svgAssets,
  socialProfiles,
  scriptIds,
  topics,
}: Input): ContentAppInit => {
  const isPublic = authored.kind === "public";
  const isError = authored.kind === "error";

  if (!isPublic && !isError) {
    throw new Error(
      `Unsupported content kind: ${String((authored as { kind: unknown }).kind)}`,
    );
  }

  if (isError && authored.status === undefined) {
    throw new Error(`Error content "${authored.id}" requires a status`);
  }

  const scripts = isPublic ? (authored.scripts ?? []) : [];

  const resolvedScripts = scripts.map((id): ScriptAssetId => {
    const script = scriptIds.find((candidate) => candidate === id);

    if (!script) {
      throw new Error(`Unknown script "${id}" in content "${authored.id}"`);
    }

    return script;
  });

  const pagePresentation = authored.pagePresentation ?? defaultPagePresentation;

  const dates = {
    created: authored.dates.created,
    lastUpdated: authored.dates.lastUpdated ?? null,
  };

  return {
    id: authored.id,
    kind: authored.kind,
    pageType: authored.pageType,
    render: authored.render,
    label: authored.label,
    status: authored.status ?? 200,
    slug: isPublic ? authored.slug : null,
    pagePresentation: {
      layout: pagePresentation.layout,
      header: {
        transparent: pagePresentation.header.appearance === "transparent",
        inverted: pagePresentation.header.colourScheme === "inverted",
      },
    },

    breadcrumbs: authored.breadcrumbs,

    dates,

    metadata: {
      title: authored.metadata.title,
      description: authored.metadata.description,
      sitemap: isPublic ? authored.metadata.sitemap : false,
    },
    topics: isPublic ? (authored.topics ?? []) : [],

    scripts: resolvedScripts,

    structuredData:
      isPublic && authored.structuredData
        ? resolveStructuredDataAppInit(authored.structuredData)
        : null,

    body: resolveContentBodyAppInit({
      authored: authored.body,
      svgAssets,
      socialProfiles,
      dates,
      topics,
    }),
  };
};
