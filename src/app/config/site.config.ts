// src/app/config/site.config.ts

import type { Person, WebSite, WithContext } from "schema-dts";

import type { SiteConfig, SocialMediaLinks } from "@types-src/siteConfig.types";

import globalScripts from "@app/renderers/partials/globalScripts.partial";
import inlineSvgSprite from "@app/renderers/partials/inlineSvgSprite.partial";

const socialMedia: SocialMediaLinks = {
  gitHub: "https://github.com/Kevin-Ellen",
  instagram: "https://www.instagram.com/photography.mallard",
  linkedIn: "https://www.linkedin.com/in/kevinellen/",
};

const sameAs = Object.values(socialMedia);

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

const siteConfig: SiteConfig = {
  language: "en-GB",
  siteName: "Kevin Ellen",
  siteUrl: "https://kevinellen.com",
  docFooter: {
    inlineSvgSprite: inlineSvgSprite,
    scripts: globalScripts,
    structuredData: [structuredDataPerson, structuredDataWebSite],
  },
  socialMedia: socialMedia,
};
export default siteConfig;
