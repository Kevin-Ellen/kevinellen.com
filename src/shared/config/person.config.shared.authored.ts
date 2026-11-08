// src/shared/config/person.config.shared.authored.ts

import type { PersonConfigAuthored } from "../types/config/person.config.shared.authored.type";

export const personConfigAuthored = {
  name: "Kevin Ellen",
  description:
    "Wildlife and nature photographer based in Loughton, Essex, with a professional background in software engineering, technical SEO and systems architecture. His photography focuses on wildlife behaviour, natural environments and field observations.",
  knowsAbout: [
    "Wildlife Photography",
    "Nature Photography",
    "Bird Photography",
    "Wildlife Behaviour",
    "Nature Writing",
    "Software Engineering",
    "Systems Architecture",
    "Technical SEO",
  ],
  image: "/assets/images/kevin-ellen-photography-in-albania-2026-08-28.jpg",
  jobTitles: [
    "Wildlife Photographer",
    "Senior Growth Automation & Systems Strategist",
  ],
  nationality: "NL",
  knowsLanguage: ["en-GB", "nl-NL"],
  address: {
    addressLocality: "Loughton",
    addressRegion: "Essex",
    addressCountry: "GB",
  },
  birthDate: "1986-03-22",
  birthPlace: {
    addressLocality: "Rotterdam",
    addressRegion: "Zuid-Holland",
    addressCountry: "NL",
  },
  socialProfiles: {
    instagram: "https://www.instagram.com/kevin.ellen.photography",
    gitHub: "https://github.com/Kevin-Ellen",
    imdb: "https://www.imdb.com/name/nm5886775/",
    linkedIn: "https://www.linkedin.com/in/kevinellen/",
    twitter: "https://x.com/kevin_ellen_",
  },
} as const satisfies PersonConfigAuthored;
