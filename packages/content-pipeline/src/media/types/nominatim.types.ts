// packages/content-pipeline/src/media/types/nominatim.types.ts

export type NominatimReverseResponse = {
  place_id?: number;
  lat?: string;
  lon?: string;
  addresstype?: string;
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
};
