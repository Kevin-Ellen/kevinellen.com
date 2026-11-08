// src/app/life-cycle/app-resolve/resolvers/registry/content/content.registry.resolver.app-resolve.ts

import type { AppInit } from "../../../../app-init/class.app-init";
import type { PublishedRegistry } from "../../../../../../shared/types/content/kv-ledger.content.shared.type";
import type {
  ContentRegistryAppResolve,
  ContentRegistryBundledEntryAppResolve,
  ContentRegistryPublishedEntryAppResolve,
} from "../../../../../types/registries/content.registry.app-resolve.type";

type Input = Readonly<{
  appInit: AppInit;
  ledger: PublishedRegistry;
}>;

export const resolveContentRegistryAppResolve = ({
  appInit,
  ledger,
}: Input): ContentRegistryAppResolve => {
  const bundled: Record<string, ContentRegistryBundledEntryAppResolve> = {};

  for (const [slug, content] of Object.entries(appInit.content.bySlug)) {
    bundled[slug] = {
      source: "bundled",
      id: content.id,
      slug,
      label: content.label,
    };
  }

  const published: Record<string, ContentRegistryPublishedEntryAppResolve> = {};

  for (const [slug, content] of Object.entries(ledger.bySlug)) {
    if (Object.hasOwn(bundled, slug)) {
      throw new Error(`Duplicate content slug: ${slug}`);
    }

    published[slug] = {
      source: "published",
      id: content.id,
      slug,
      label: content.label,
      photos: content.photos,
      dateCreated: content.dateCreated,
      intro: content.intro,
      title: content.title,
    };
  }

  const errorsByStatus: Record<number, ContentRegistryBundledEntryAppResolve> =
    {};

  for (const [status, content] of Object.entries(
    appInit.content.errorsByStatus,
  )) {
    errorsByStatus[Number(status)] = {
      source: "bundled",
      id: content.id,
      slug: content.slug ?? "",
      label: content.label,
    };
  }

  return {
    bySlug: {
      ...bundled,
      ...published,
    },
    errorsByStatus,
  };
};
