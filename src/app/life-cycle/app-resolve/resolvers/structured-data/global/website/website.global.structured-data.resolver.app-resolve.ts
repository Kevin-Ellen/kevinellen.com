// src/app/life-cycle/app-resolve/resolvers/structured-data/global/website/website.global.structured-data.resolver.app-resolve.ts

import type { WebSite } from "schema-dts";
import type { SiteConfigAppResolve } from "../../../../../../types/config/site.config.app-resolve.type";

type Input = Readonly<{
  name: string;
  description: string;
  canonicalDomain: SiteConfigAppResolve["canonicalDomain"];
  language: string;
}>;

export const resolveWebsiteAppResolve = ({
  name,
  description,
  canonicalDomain,
  language,
}: Input): WebSite => ({
  "@type": "WebSite",
  "@id": new URL("#website", canonicalDomain).toString(),
  url: canonicalDomain,
  name,
  description,
  inLanguage: language,
  publisher: {
    "@id": new URL("#person", canonicalDomain).toString(),
  },
});
