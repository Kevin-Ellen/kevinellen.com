// src/config/structured-data.config.ts

import type { StructuredDataConfig } from "@shared-types/config/structured-data.config.types";

import { deepFreeze } from "@utils/deepFreeze.util";

export const structuredDataConfig: StructuredDataConfig = deepFreeze({
  person: {
    id: "https://kevinellen.com/about#person",
    url: "https://kevinellen.com/about",
    name: "Kevin Ellen",
    jobTitle: "Technical SEO Manager",
    description: "Hello world",
    addressRegion: "Essex",
    addressCountry: "GB",
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
  },

  website: {
    id: "https://kevinellen.com/#website",
    url: "https://kevinellen.com/",
    name: "Kevin Ellen",
    description:
      "Wildlife photography, field notes, and technical work exploring nature and digital publishing.",
    inLanguage: "en-GB",
    publisherId: "https://kevinellen.com/about#person",
  },
});
