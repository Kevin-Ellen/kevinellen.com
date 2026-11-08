// src/app/life-cycle/app-resolve/resolvers/content/content.resolver.app-resolve.ts

import type { AppInit } from "../../../app-init/class.app-init";
import type { ContentAppResolve } from "../../../../types/document/page/content/content.page.document.app-resolve.type";
import type { ContentRegistryAppResolve } from "../../../../types/registries/content.registry.app-resolve.type";
import type { PhotoGetter } from "../../getters/photo-kv/photo-kv.getter.app-resolve";
import type { PersonConfigAppInit } from "../../../../../shared/types/config/person.config.shared.app-init.type";
import type { SiteConfigAppInit } from "../../../../../shared/types/config/site.config.shared.app-init.type";
import type { PublishedRegistry } from "../../../../../shared/types/content/kv-ledger.content.shared.type";

import { resolveContentBodyAppResolve } from "./body/body.content.app-resolve";
import { resolveContentBreadcrumbsAppResolve } from "./breadcrumbs/breadcrumbs.content.resolver.app-resolve";

type ContentAppInit =
  | AppInit["content"]["bySlug"][string]
  | NonNullable<AppInit["content"]["errorsByStatus"][404]>;

type Input = Readonly<{
  content: ContentAppInit;
  contentRegistry: ContentRegistryAppResolve;
  getPhoto: PhotoGetter;
  person: PersonConfigAppInit;
  site: SiteConfigAppInit;
  journalLedger: PublishedRegistry;
  requestedPage: number;
}>;

export const resolveContentAppResolve = async ({
  content,
  contentRegistry,
  getPhoto,
  person,
  site,
  journalLedger,
  requestedPage,
}: Input): Promise<ContentAppResolve> => ({
  ...content,

  metadata: {
    ...content.metadata,
    title: `${content.metadata.title}${site.titleSuffix}`,
  },
  breadcrumbs: resolveContentBreadcrumbsAppResolve({
    breadcrumbs: content.breadcrumbs,
    contentRegistry,
  }),
  body: await resolveContentBodyAppResolve({
    content: content.body,
    contentRegistry,
    getPhoto,
    journalLedger,
    requestedPage,
    publication: {
      author: person.name,
      published: content.dates.created,
      lastUpdated: content.dates.lastUpdated,
    },
  }),
});
