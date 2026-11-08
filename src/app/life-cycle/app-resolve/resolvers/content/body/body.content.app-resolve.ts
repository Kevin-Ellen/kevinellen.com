// src/app/life-cycle/app-resolve/resolvers/content/body/body.content.app-resolve.ts

import type { ContentBodyAppInit } from "../../../../../../shared/types/content/body/body.content.shared.app-init.type";
import type { ContentBodyAppResolve } from "../../../../../types/document/page/body.page.document.app-resolve.type";
import type { ContentRegistryAppResolve } from "../../../../../types/registries/content.registry.app-resolve.type";
import type { PhotoGetter } from "../../../getters/photo-kv/photo-kv.getter.app-resolve";
import type { PublishedRegistry } from "../../../../../../shared/types/content/kv-ledger.content.shared.type";

import { resolveContentBodyFooterAppResolve } from "./footer/footer.body.content.app-resolve";
import { resolveContentModuleAppResolve } from "../modules/module.content.resolver.app-resolve";

type Input = Readonly<{
  content: ContentBodyAppInit;
  contentRegistry: ContentRegistryAppResolve;
  getPhoto: PhotoGetter;
  publication: Readonly<{
    author: string;
    published: string;
    lastUpdated: string | null;
  }>;
  journalLedger: PublishedRegistry;
  requestedPage: number;
}>;

export const resolveContentBodyAppResolve = async ({
  content,
  contentRegistry,
  getPhoto,
  publication,
  journalLedger,
  requestedPage,
}: Input): Promise<ContentBodyAppResolve> => ({
  modules: await Promise.all(
    content.modules.map((module) =>
      resolveContentModuleAppResolve({
        content: module,
        contentRegistry,
        getPhoto,
        journalLedger,
        requestedPage,
      }),
    ),
  ),

  footer: await resolveContentBodyFooterAppResolve({
    content: content.footer,
    publication,
  }),
});
