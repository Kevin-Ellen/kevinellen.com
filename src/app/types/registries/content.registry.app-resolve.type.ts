// src/app/types/registries/content.registry.app-resolve.type.ts

type RegistryEntryBase = Readonly<{
  id: string;
  slug: string;
  label: string;
}>;

export type ContentRegistryBundledEntryAppResolve = RegistryEntryBase &
  Readonly<{
    source: "bundled";
  }>;

export type ContentRegistryPublishedEntryAppResolve = RegistryEntryBase &
  Readonly<{
    source: "published";
    photos: readonly string[];
    dateCreated: string;
    intro: string;
    title: string;
  }>;

export type ContentRegistryEntryAppResolve =
  | ContentRegistryBundledEntryAppResolve
  | ContentRegistryPublishedEntryAppResolve;

export type ContentRegistryAppResolve = Readonly<{
  bySlug: Readonly<Record<string, ContentRegistryEntryAppResolve>>;
  errorsByStatus: Readonly<
    Record<number, ContentRegistryBundledEntryAppResolve>
  >;
}>;
