// src/app/config/structuredData.config.ts

import type { Person, WebSite, WithContext } from "schema-dts";
import type { SocialMediaMap } from "@app/config/site.config.types";
import type { StructuredDataNode } from "@app/config/structuredData.config.types";

export const buildSiteStructuredData = (
  socialMedia: SocialMediaMap,
): StructuredDataNode[] => {
  const sameAs: string[] = Object.values(socialMedia).map((item) => item.href);

  const structuredDataPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://kevinellen.com/about#person",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://kevinellen.com/about",
    },
    name: "Kevin Ellen",
    jobTitle: "Technical SEO Manager",
    hasOccupation: {
      "@type": "Occupation",
      name: "Technical SEO Manager",
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "Essex",
      addressCountry: "GB",
    },
    description: "Hello world",
    sameAs,
    url: "https://kevinellen.com/about",
    knowsAbout: [
      "Wildlife photography",
      "Nature photography",
      "Bird photography",
      "Technical SEO",
      "Web performance",
      "Web architecture",
      "Cloudflare Workers",
      "Search engine optimisation",
      "Digital publishing",
    ],
  } satisfies WithContext<Person>;

  const structuredDataWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://kevinellen.com/#website",
    url: "https://kevinellen.com/",
    name: "Kevin Ellen",
    description:
      "Wildlife photography, field notes, and technical work exploring nature and digital publishing.",
    inLanguage: "en-GB",
    publisher: {
      "@id": "https://kevinellen.com/about#person",
    },
  } satisfies WithContext<WebSite>;

  return [structuredDataPerson, structuredDataWebSite];
};
