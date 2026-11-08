// src/app/life-cycle/app-resolve/getters/photo-kv/photo-kv.getter.app-resolve.ts

import type { PhotoAppResolve } from "../../../../types/photo/photo.app-resolve.type";

export type PhotoGetter = (photoId: string) => Promise<PhotoAppResolve | null>;

type ValidatedPublishedPhoto = Record<string, unknown> & {
  id: string;
  title: string;
  alt: string;
  width: number;
  height: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isPositiveFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const isSpecies = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.name === "string" &&
    typeof value.scientificName === "string" &&
    (value.taxonRank === undefined || value.taxonRank === "species")
  );
};

const hasValidPhotoEnvelope = (
  value: unknown,
  photoId: string,
): value is ValidatedPublishedPhoto => {
  if (!isRecord(value)) {
    return false;
  }

  if (
    value.id !== photoId ||
    typeof value.title !== "string" ||
    typeof value.alt !== "string" ||
    !isPositiveFiniteNumber(value.width) ||
    !isPositiveFiniteNumber(value.height)
  ) {
    return false;
  }

  return (
    value.species === null ||
    (Array.isArray(value.species) && value.species.every(isSpecies))
  );
};

export const createPhotoGetter = (kv: KVNamespace): PhotoGetter => {
  const cache = new Map<string, Promise<PhotoAppResolve | null>>();

  return (photoId) => {
    const existing = cache.get(photoId);

    if (existing) {
      return existing;
    }

    const pending = (async (): Promise<PhotoAppResolve | null> => {
      const key = `photo:${photoId}`;
      const photo = await kv.get<unknown>(key, "json");

      if (photo === null) {
        return null;
      }

      if (!hasValidPhotoEnvelope(photo, photoId)) {
        throw new Error(`Invalid published photo in KV: ${key}`);
      }

      return {
        ...photo,
        dimensions: {
          width: photo.width,
          height: photo.height,
        },
      } as PhotoAppResolve;
    })();

    cache.set(photoId, pending);

    void pending.catch(() => {
      cache.delete(photoId);
    });

    return pending;
  };
};
