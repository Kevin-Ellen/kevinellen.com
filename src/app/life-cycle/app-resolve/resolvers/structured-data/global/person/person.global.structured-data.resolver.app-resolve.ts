// src/app/life-cycle/app-resolve/resolvers/structured-data/global/person/person.global.structured-data.resolver.app-resolve.ts

import type { Person } from "schema-dts";

import type { PersonConfigAppInit } from "../../../../../../../shared/types/config/person.config.shared.app-init.type";

type Input = Readonly<{
  person: PersonConfigAppInit;
}>;

export const resolvePersonAppResolve = ({ person }: Input): Person => ({
  "@type": "Person",
  "@id": `${person.website}/#person`,
  name: person.name,
  description: person.description,
  url: person.website,
  image: new URL(person.image, person.website).toString(),
  knowsAbout: [...person.knowsAbout],
  jobTitle: [...person.jobTitles],
  nationality: person.nationality,
  knowsLanguage: [...person.knowsLanguage],
  address: {
    "@type": "PostalAddress",
    ...person.address,
  },
  birthDate: person.birthDate,
  birthPlace: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      ...person.birthPlace,
    },
  },
  sameAs: Object.values(person.socialProfiles),
});
