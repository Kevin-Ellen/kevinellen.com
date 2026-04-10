// packages/content-pipeline/src/photos/helpers/map.nominatim.location.ts

import type { ResolvedPhotoLocation } from "@shared-types/photos/photo.draft.types";
import type { NominatimReverseResponse } from "@content-pipeline/photos/types/nominatim.types";

const toStringOrNull = (value: unknown): string | null => {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
};

export const mapNominatimLocation = (
  response: NominatimReverseResponse,
): ResolvedPhotoLocation => {
  return {
    name: toStringOrNull(response.name),
    road: toStringOrNull(response.address?.road),
    village: toStringOrNull(response.address?.village),
    town: toStringOrNull(response.address?.town),
    city: toStringOrNull(response.address?.city),
    county: toStringOrNull(response.address?.county),
    state: toStringOrNull(response.address?.state),
    country: toStringOrNull(response.address?.country),
    countryCode:
      toStringOrNull(response.address?.country_code)?.toUpperCase() ?? null,
    postcode: toStringOrNull(response.address?.postcode),
    displayName: toStringOrNull(response.display_name),
  };
};
