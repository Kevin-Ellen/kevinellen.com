// src/app/life-cycle/routing/matching/matching.routing.ts

import type { AppInit } from "../../app-init/class.app-init";
import type { PublishedRegistry } from "../../../../shared/types/content/kv-ledger.content.shared.type";
import type { RoutingResult } from "../../../types/routing/routing.shared.type";
import { paginate } from "../../../../shared/utilities/paginate/paginate.utility.shared";

type Input = Readonly<{
  pathname: string;
  appInit: AppInit;
  ledger: PublishedRegistry;
}>;

type PaginationMatch = Readonly<{
  contentPathname: string;
  page: number;
}>;

const matchPagination = (pathname: string): PaginationMatch | null => {
  const match = pathname.match(
    /^\/(journal|topics(?:\/(?!page-\d+$)[^/]+)?)\/page-(\d+)$/,
  );

  if (!match) {
    return null;
  }

  const page = Number(match[2]);

  if (!Number.isSafeInteger(page) || page < 1) {
    return null;
  }

  return {
    contentPathname: pathname.slice(0, pathname.lastIndexOf("/page-")),
    page,
  };
};

export const matchRouting = ({
  pathname,
  appInit,
  ledger,
}: Input): RoutingResult<PublishedRegistry> => {
  if (appInit.content.bySlug[pathname]) {
    return {
      kind: "selected",
      pathname,
      contentPathname: pathname,
      source: "bundled",
      ledger,
    };
  }

  if (ledger.bySlug[pathname]) {
    return {
      kind: "selected",
      pathname,
      contentPathname: pathname,
      source: "published",
      ledger,
    };
  }

  const pagination = matchPagination(pathname);

  if (pagination) {
    const content = appInit.content.bySlug[pagination.contentPathname];

    if (content) {
      const listing = content.body.modules.find(
        (module) =>
          module.kind === "journalListing" || module.kind === "topicListing",
      );

      if (listing?.pagination) {
        const page = (() => {
          if (listing.kind === "journalListing") {
            const { topicId } = listing;

            const items =
              topicId === null
                ? ledger.newestFirst
                : ledger.newestFirst.filter((entry) =>
                    entry.topics.includes(topicId),
                  );

            return paginate({
              items,
              requestedPage: pagination.page,
              pageSize: listing.pageSize,
            });
          }

          return paginate({
            items: listing.items,
            requestedPage: pagination.page,
            pageSize: listing.pageSize,
          });
        })();

        if (page) {
          return {
            kind: "selected",
            pathname,
            contentPathname: pagination.contentPathname,
            pagination: {
              page: pagination.page,
            },
            source: "bundled",
            ledger,
          };
        }
      }
    }
  }

  return {
    kind: "not-found",
    status: 404,
    pathname,
    ledger,
  };
};
