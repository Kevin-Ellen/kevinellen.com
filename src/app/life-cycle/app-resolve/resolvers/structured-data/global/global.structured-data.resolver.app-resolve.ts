// src/app/life-cycle/app-resolve/resolvers/structured-data/global/global.structured-data.resolver.app-resolve.ts

import type { Graph } from "schema-dts";

import type { PersonConfigAppInit } from "../../../../../../shared/types/config/person.config.shared.app-init.type";
import type { SiteConfigAppInit } from "../../../../../../shared/types/config/site.config.shared.app-init.type";

import { resolvePersonAppResolve } from "./person/person.global.structured-data.resolver.app-resolve";
import { resolveWebsiteAppResolve } from "./website/website.global.structured-data.resolver.app-resolve";

type Input = Readonly<{
  person: PersonConfigAppInit;
  site: SiteConfigAppInit;
}>;

export const resolveGlobalStructuredDataAppResolve = ({
  person,
  site,
}: Input): Graph["@graph"] => [
  resolvePersonAppResolve({ person }),
  resolveWebsiteAppResolve({
    name: site.name,
    description: site.description,
    canonicalDomain: site.canonicalDomain,
    language: site.language,
  }),
];
