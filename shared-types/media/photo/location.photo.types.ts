// shared-types/media/photo/location.photo.types.ts

export type AuthoredResolvedLocation = Readonly<{
  name: string | null;
  road: string | null;
  village: string | null;
  town: string | null;
  city: string | null;
  county: string | null;
  state: string | null;
  country: string | null;
  countryCode: string | null;
  postcode: string | null;
  displayName: string | null;
}>;
