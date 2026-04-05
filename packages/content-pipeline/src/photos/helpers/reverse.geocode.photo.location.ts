// packages/content-pipeline/src/photos/helpers/reverse.geocode.photo.location.ts

import type { ResolvedPhotoLocation } from "@shared-types/photos/photo.draft.types";
import type { NominatimReverseResponse } from "@content-pipeline/photos/types/nominatim.types";
import { mapNominatimLocation } from "./map.nominatim.location";

type ReverseGeocodePhotoLocationInput = {
  latitude: number;
  longitude: number;
};

const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";

const CONTENT_PIPELINE_USER_AGENT =
  "kevinellen-content-pipeline/1.0 (local author workflow)";

export const reverseGeocodePhotoLocation = async ({
  latitude,
  longitude,
}: ReverseGeocodePhotoLocationInput): Promise<ResolvedPhotoLocation | null> => {
  const url = new URL(NOMINATIM_REVERSE_URL);

  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");

  const response = await fetch(url, {
    headers: {
      "User-Agent": CONTENT_PIPELINE_USER_AGENT,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Reverse geocode request failed with status ${response.status}`,
    );
  }

  const json = (await response.json()) as NominatimReverseResponse;

  return mapNominatimLocation(json);
};
