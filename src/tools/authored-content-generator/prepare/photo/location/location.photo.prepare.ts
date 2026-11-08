// src/tools/authored-content-generator/prepare/photo/location/location.photo.prepare.ts

import tzLookup from "tz-lookup";

import type { PhotoResolvedLocationAuthored } from "../../../../../content-schema/assets/photo/photo.asset.content-schema.authored.type";

type NominatimAddress = Readonly<{
  road?: string;
  village?: string;
  town?: string;
  city?: string;
  county?: string;
  state?: string;
  country?: string;
  country_code?: string;
  postcode?: string;
}>;

type NominatimResponse = Readonly<{
  name?: string;
  display_name?: string;
  address?: NominatimAddress;
}>;

const locationCache = new Map<string, PhotoResolvedLocationAuthored>();

const delay = async (milliseconds: number): Promise<void> =>
  new Promise((resolveDelay) => {
    setTimeout(resolveDelay, milliseconds);
  });

export const resolvePhotoTimezone = (
  latitude: number | null,
  longitude: number | null,
): string | null => {
  if (latitude === null || longitude === null) {
    return null;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new Error("Invalid photo GPS coordinates");
  }

  return tzLookup(latitude, longitude);
};

export const resolvePhotoLocation = async (
  latitude: number | null,
  longitude: number | null,
): Promise<PhotoResolvedLocationAuthored | null> => {
  if (latitude === null || longitude === null) {
    return null;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new Error("Invalid photo GPS coordinates");
  }

  const cacheKey = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
  const cached = locationCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");

  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("zoom", "18");
  url.searchParams.set("addressdetails", "1");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "KevinEllenContentGenerator/1.0",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to resolve photo location (${response.status})`);
  }

  const data = await response.json<NominatimResponse>();
  const address = data.address ?? {};

  const resolvedLocation: PhotoResolvedLocationAuthored = {
    name: data.name ?? null,
    road: address.road ?? null,
    village: address.village ?? null,
    town: address.town ?? null,
    city: address.city ?? null,
    county: address.county ?? null,
    state: address.state ?? null,
    country: address.country ?? null,
    countryCode: address.country_code ?? null,
    postcode: address.postcode ?? null,
    displayName: data.display_name ?? null,
  };

  locationCache.set(cacheKey, resolvedLocation);

  // Keep sequential public Nominatim requests rate-limited.
  await delay(1100);

  return resolvedLocation;
};
