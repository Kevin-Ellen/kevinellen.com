// src/app/life-cycle/app-resolve/resolvers/structured-data/derived/journal-entry/journal-entry.derived.structured-data.resolver.app-resolve.ts

import type { Graph } from "schema-dts";

import type { ContentAppResolve } from "../../../../../../types/document/page/content/content.page.document.app-resolve.type";
import type { SiteConfigAppResolve } from "../../../../../../types/config/site.config.app-resolve.type";
import type { PhotoComponentContentAppResolve } from "../../../../../../types/document/page/content/components/photo/photo.component.content.page.document.app-resolve.type";

type Input = Readonly<{
  content: ContentAppResolve;
  site: SiteConfigAppResolve;
}>;

type Photo = PhotoComponentContentAppResolve["photo"];

const collectPhotos = (content: ContentAppResolve): readonly Photo[] => {
  const photos = new Map<string, Photo>();

  const addPhoto = (photo: Photo): void => {
    photos.set(photo.id, photo);
  };

  const collectModule = (
    module: ContentAppResolve["body"]["modules"][number],
  ): void => {
    if (module.kind === "featuredPhoto") {
      addPhoto(module.photo);
    }

    if (module.kind === "richContent") {
      for (const component of module.components) {
        if (component.kind === "photo") {
          addPhoto(component.photo);
        }
      }
    }

    if (module.kind === "photoPair") {
      for (const component of module.photos) {
        addPhoto(component.photo);
      }
    }

    if (module.kind === "articleSection") {
      for (const entry of module.entries) {
        collectModule(entry.module);
      }
    }

    if (module.kind === "photoSequence") {
      for (const component of module.photos) {
        addPhoto(component.photo);
      }
    }

    if (module.kind === "finalWords") {
      for (const component of module.components) {
        if (component.kind === "photo") {
          addPhoto(component.photo);
        }
      }
    }
  };

  for (const module of content.body.modules) {
    collectModule(module);
  }

  return [...photos.values()];
};

export const resolveJournalDerivedStructuredDataAppResolve = ({
  content,
  site,
}: Input): Graph["@graph"] => {
  if (content.pageType !== "journalEntry") {
    return [];
  }

  const origin = site.canonicalDomain.replace(/\/$/, "");
  if (!content.slug) {
    throw new Error("Journal entry requires a slug for structured data");
  }

  const url = new URL(content.slug, `${origin}/`).toString();
  const personId = `${origin}/#person`;

  const intro = content.body.modules.find(
    (module) => module.kind === "pageIntro",
  );

  if (!intro) {
    throw new Error(`Journal entry missing pageIntro: ${content.slug}`);
  }

  const photos = collectPhotos(content);

  const imageId = (photo: Photo): string =>
    `${url}#image-${encodeURIComponent(photo.id)}`;

  const imageUrl = (photo: Photo): string =>
    `${origin}/media/photo/${photo.dimensions.width}/${photo.dimensions.height}/${encodeURIComponent(photo.id)}`;

  const exifProperty = (
    name: string,
    value: number | null | undefined,
    unitText?: string,
  ) =>
    value == null || !Number.isFinite(value)
      ? []
      : [
          {
            "@type": "PropertyValue" as const,
            name,
            value,
            ...(unitText && { unitText }),
          },
        ];

  const resolveExifData = (photo: Photo) => [
    ...exifProperty("ExposureTime", photo.exposureTime, "seconds"),
    ...exifProperty("FNumber", photo.aperture),
    ...exifProperty("FocalLength", photo.focalLength, "mm"),
    ...exifProperty("PhotographicSensitivity", photo.iso),
  ];

  const resolveTaxonomy = (photo: Photo) =>
    photo.species?.map((species) => ({
      "@type": "Taxon" as const,
      name: species.name,
      scientificName: species.scientificName,
      taxonRank: "species" as const,
    })) ?? [];

  const images = photos.map((photo) => {
    const exifData = resolveExifData(photo);
    const taxonomy = resolveTaxonomy(photo);

    return {
      "@type": "ImageObject" as const,
      "@id": imageId(photo),
      url: imageUrl(photo),
      contentUrl: imageUrl(photo),
      name: photo.title,
      description: photo.alt,
      caption: photo.commentary ?? photo.alt,
      width: {
        "@type": "QuantitativeValue" as const,
        value: photo.width,
        unitCode: "E37",
      },
      height: {
        "@type": "QuantitativeValue" as const,
        value: photo.height,
        unitCode: "E37",
      },
      dateCreated: photo.capturedAt.utc,
      creator: {
        "@id": personId,
      },
      creditText: photo.photographer,
      copyrightNotice: photo.copyright,
      license: `${origin}/legal/licensing`,
      acquireLicensePage: `${origin}/legal/licensing`,
      ...(photo.readableLocation && {
        contentLocation: {
          "@type": "Place" as const,
          name: photo.readableLocation,
        },
      }),
      ...(taxonomy.length > 0 && { about: taxonomy }),
      ...(exifData.length > 0 && { exifData }),
    };
  });

  const article = {
    "@type": "Article" as const,
    "@id": `${url}#article`,
    url,
    headline: intro.title,
    description: intro.description ?? content.metadata.description,
    inLanguage: site.language,
    datePublished: content.dates.created,
    ...(content.dates.lastUpdated && {
      dateModified: content.dates.lastUpdated,
    }),
    author: {
      "@id": personId,
    },
    publisher: {
      "@id": personId,
    },
    mainEntityOfPage: {
      "@id": url,
    },
    image: photos.map((photo) => ({
      "@id": imageId(photo),
    })),
  };

  return [article, ...images];
};
