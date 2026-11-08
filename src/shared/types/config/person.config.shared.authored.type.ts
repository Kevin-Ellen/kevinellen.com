// src/shared/types/config/person.config.shared.authored.type.ts

export type PersonConfigAuthored = Readonly<{
  name: string;
  description: string;
  knowsAbout: readonly string[];
  image: string;
  jobTitles: readonly string[];
  nationality: string;
  knowsLanguage: readonly string[];
  address: Readonly<{
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  }>;
  birthDate: string;
  birthPlace: Readonly<{
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  }>;
  socialProfiles: Readonly<Record<string, string>>;
}>;
