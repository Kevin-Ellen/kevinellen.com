// packages/content-cli/src/content/photo/utils/location.photo.util.content.ts

import type { AuthoredResolvedLocation } from "@shared-types/media/photo/location.photo.types";

type NominatimResponse = Readonly<{
  name?: string;
  display_name?: string;
  address?: {
    road?: string;
    village?: string;
    town?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
    postcode?: string;
  };
}>;

export const resolvePhotoLocation = async (
  latitude: number | null,
  longitude: number | null,
): Promise<AuthoredResolvedLocation | null> => {
  if (latitude === null || longitude === null) {
    return null;
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");

  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("zoom", "18");
  url.searchParams.set("addressdetails", "1");

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "KevinEllenContentCLI/1.0",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to resolve photo location (${response.status})`);
  }

  const data = (await response.json()) as NominatimResponse;

  return {
    name: data.name ?? null,
    road: data.address?.road ?? null,
    village: data.address?.village ?? null,
    town: data.address?.town ?? null,
    city: data.address?.city ?? null,
    county: data.address?.county ?? null,
    state: data.address?.state ?? null,
    country: data.address?.country ?? null,
    countryCode: data.address?.country_code ?? null,
    postcode: data.address?.postcode ?? null,
    displayName: data.display_name ?? null,
  };
};
