// src/app/life-cycle/app-resolve/resolvers/structured-data/derived/derived.structured-data.resolver.app-resolve.ts

import type { Graph } from "schema-dts";

import type { ContentAppResolve } from "../../../../../types/document/page/content/content.page.document.app-resolve.type";
import type { SiteConfigAppResolve } from "../../../../../types/config/site.config.app-resolve.type";
import type { ContentPageType } from "../../../../../../content-schema/content/content.content-schema.type";

import { resolveBreadcrumbsDerivedStructuredDataAppResolve } from "./breadcrumbs/breadcrumbs.derived.structured-data.resolver.app-resolve";
import { resolveJournalDerivedStructuredDataAppResolve } from "./journal-entry/journal-entry.derived.structured-data.resolver.app-resolve";

type Input = Readonly<{
  content: ContentAppResolve;
  site: SiteConfigAppResolve;
}>;

type Resolver = (input: Input) => Graph["@graph"];

const resolvers = {
  journalEntry: resolveJournalDerivedStructuredDataAppResolve,
} satisfies Partial<Record<ContentPageType, Resolver>>;

export const resolveDerivedStructuredDataAppResolve = ({
  content,
  site,
}: Input): Graph["@graph"] => {
  const resolver = resolvers[content.pageType as keyof typeof resolvers] as
    | Resolver
    | undefined;

  return [
    ...(content.breadcrumbs.length > 1
      ? [
          resolveBreadcrumbsDerivedStructuredDataAppResolve({
            breadcrumbs: content.breadcrumbs,
            canonicalDomain: site.canonicalDomain,
          }),
        ]
      : []),

    ...(resolver?.({ content, site }) ?? []),
  ];
};
