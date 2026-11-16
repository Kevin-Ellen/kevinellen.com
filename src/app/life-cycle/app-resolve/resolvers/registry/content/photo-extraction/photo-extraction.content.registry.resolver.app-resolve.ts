// src/app/life-cycle/app-resolve/resolvers/registry/content/photo-extraction/photo-extraction.content.registry.resolver.app-resolve.ts

import type { ContentBodyAppInit } from "../../../../../../../shared/types/content/body/body.content.shared.app-init.type";
import type { BundledRegistryPhotoAppResolve } from "../../../../../../types/photo/photo.app-resolve.type";

type Input = Readonly<{
  body: ContentBodyAppInit;
}>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const resolveContentPhotosAppResolve = ({
  body,
}: Input): readonly BundledRegistryPhotoAppResolve[] => {
  const photos: BundledRegistryPhotoAppResolve[] = [];

  const collect = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(collect);
      return;
    }

    if (!isRecord(value)) return;

    for (const key of ["media", "image", "photo", "photos"]) {
      const candidate = value[key];

      if (typeof candidate === "string") {
        photos.push({ src: candidate, width: null, height: null });
      } else if (Array.isArray(candidate)) {
        collect(candidate);
      } else if (isRecord(candidate)) {
        const reference = candidate.src ?? candidate.id;

        if (typeof reference === "string") {
          photos.push({
            src: reference,
            width: typeof candidate.width === "number" ? candidate.width : null,
            height:
              typeof candidate.height === "number" ? candidate.height : null,
          });
        }
      }
    }

    for (const [key, nested] of Object.entries(value)) {
      if (["media", "image", "photo", "photos"].includes(key)) continue;

      if (isRecord(nested) || Array.isArray(nested)) {
        collect(nested);
      }
    }
  };

  collect(body.modules);

  return [...new Map(photos.map((photo) => [photo.src, photo])).values()];
};
