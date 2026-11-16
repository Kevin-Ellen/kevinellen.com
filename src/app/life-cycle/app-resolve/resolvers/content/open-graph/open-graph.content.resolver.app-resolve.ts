// src/app/life-cycle/app-resolve/resolvers/content/open-graph/open-graph.content.resolver.app-resolve.ts

import type { ContentPageType } from "../../../../../../content-schema/content/content.content-schema.type";
import type { OpenGraphAppInit } from "../../../../../../shared/types/content/open-graph.content.shared.type";
import type { OpenGraphAppResolve } from "../../../../../types/document/open-graph/open-graph.document.app-resolve.type";
import type {
  ContentRegistryAppResolve,
  ContentRegistryBundledEntryAppResolve,
  ContentRegistryPublishedEntryAppResolve,
} from "../../../../../types/registries/content.registry.app-resolve.type";

const openGraphImageConfig = {
  width: 1200,
  height: 630,
} as const;

type Dimensions = Readonly<{
  width: number;
  height: number;
}>;

type RegistryEntry = ContentRegistryAppResolve["bySlug"][string];

type BundledPhoto = ContentRegistryBundledEntryAppResolve["photos"][number];

type PublishedPhoto = ContentRegistryPublishedEntryAppResolve["photos"][number];

type ResolvedImage = Readonly<{
  url: string;
  width: number | null;
  height: number | null;
}>;

type Input = Readonly<{
  pageType: ContentPageType;
  title: string;
  description: string;
  language: string;
  canonicalUrl: string;
  canonicalDomain: string;
  openGraph: OpenGraphAppInit | null;
  registryEntry: RegistryEntry | null;
}>;

const openGraphTypeRegistry = {
  standard: "website",
  journalEntry: "article",
} as const satisfies Record<ContentPageType, OpenGraphAppResolve["type"]>;

const isValidDimension = (value: number): boolean =>
  Number.isFinite(value) && value > 0 && Number.isInteger(value);

const resolveContainedDimensions = ({
  width,
  height,
}: Dimensions): Dimensions => {
  if (!isValidDimension(width) || !isValidDimension(height)) {
    throw new Error("Invalid photograph dimensions");
  }

  const scale = Math.min(
    openGraphImageConfig.width / width,
    openGraphImageConfig.height / height,
    1,
  );

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
};

const resolveAuthoredDimensions = (
  openGraph: OpenGraphAppInit | null,
): Dimensions | null => {
  const width = openGraph?.width;
  const height = openGraph?.height;

  if (width === undefined && height === undefined) {
    return null;
  }

  if (
    width === undefined ||
    height === undefined ||
    !isValidDimension(width) ||
    !isValidDimension(height)
  ) {
    throw new Error(
      "Open Graph image dimensions require valid width and height",
    );
  }

  if (!openGraph?.image) {
    throw new Error("Open Graph image dimensions require an explicit image");
  }

  return { width, height };
};

const resolveBundledImage = (
  photo: BundledPhoto,
  canonicalDomain: string,
): ResolvedImage => ({
  url: new URL(photo.src, canonicalDomain).href,
  width: null,
  height: null,
});

const resolvePublishedImage = (
  photo: PublishedPhoto,
  canonicalDomain: string,
): ResolvedImage => {
  const dimensions = resolveContainedDimensions(photo);

  return {
    url: new URL(
      `/media/photo/${dimensions.width}/${dimensions.height}/${encodeURIComponent(photo.id)}`,
      canonicalDomain,
    ).href,
    width: dimensions.width,
    height: dimensions.height,
  };
};

const resolveRegistryImage = (
  registryEntry: RegistryEntry | null,
  canonicalDomain: string,
  imageOverride: string | null,
): ResolvedImage | null => {
  // Explicit bundled assets do not have to appear in the page body.
  if (imageOverride?.startsWith("/assets/images/")) {
    return {
      url: new URL(imageOverride, canonicalDomain).href,
      width: null,
      height: null,
    };
  }

  if (!registryEntry) {
    if (imageOverride) {
      throw new Error(
        `Open Graph image "${imageOverride}" has no registry entry`,
      );
    }

    return null;
  }

  if (registryEntry.source === "bundled") {
    const photo = imageOverride
      ? registryEntry.photos.find(({ src }) => src === imageOverride)
      : registryEntry.photos[0];

    if (!photo) {
      if (imageOverride) {
        throw new Error(
          `Open Graph image "${imageOverride}" not found in bundled registry`,
        );
      }

      return null;
    }

    return resolveBundledImage(photo, canonicalDomain);
  }

  const photo = imageOverride
    ? registryEntry.photos.find(({ id }) => id === imageOverride)
    : registryEntry.photos[0];

  if (!photo) {
    if (imageOverride) {
      throw new Error(
        `Open Graph image "${imageOverride}" not found in published registry`,
      );
    }

    return null;
  }

  return resolvePublishedImage(photo, canonicalDomain);
};

export const resolveOpenGraphAppResolve = ({
  pageType,
  title,
  description,
  language,
  canonicalUrl,
  canonicalDomain,
  openGraph,
  registryEntry,
}: Input): OpenGraphAppResolve => {
  const authoredDimensions = resolveAuthoredDimensions(openGraph);

  const image = resolveRegistryImage(
    registryEntry,
    canonicalDomain,
    openGraph?.image ?? null,
  );

  return {
    type: openGraphTypeRegistry[pageType],
    title: openGraph?.title ?? title,
    description: openGraph?.description ?? description,
    language: language.replace("-", "_"),
    url: canonicalUrl,
    image: image?.url ?? null,
    imageWidth: authoredDimensions?.width ?? image?.width ?? null,
    imageHeight: authoredDimensions?.height ?? image?.height ?? null,
  };
};
