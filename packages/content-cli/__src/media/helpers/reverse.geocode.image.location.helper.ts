// packages/content-pipeline/src/media/helpers/reverse.geocode.image.location.helper.ts

import type { ResolvedImageLocation } from "@content-pipeline/media/types/resolved.image.metadata.types";
import type { NominatimReverseResponse } from "@content-pipeline/media/types/nominatim.types";

import { mapNominatimLocation } from "./map.nominatim.location.helper";

type ReverseGeocodeImageLocationInput = {
  latitude: number;
  longitude: number;
};

const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";

const CONTENT_PIPELINE_USER_AGENT =
  "kevinellen-content-pipeline/1.0 (local author workflow)";

export const reverseGeocodeImageLocation = async ({
  latitude,
  longitude,
}: ReverseGeocodeImageLocationInput): Promise<ResolvedImageLocation | null> => {
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
