// src/app/life-cycle/routing/routing.ts

import type { ValidatedEnv } from "../../entry.type";
import type { RoutingResult } from "../../types/routing/routing.shared.type";
import type { PublishedRegistry } from "../../../shared/types/content/kv-ledger.content.shared.type";

import type { AppInit } from "../app-init/class.app-init";

import { checkSystemRouting } from "./system/system.routing";
import { resolveJournalLedgerRouting } from "./ledger/ledger.routing";
import { matchRouting } from "./matching/matching.routing";

type Input = Readonly<{
  request: Request;
  env: ValidatedEnv;
  appInit: AppInit;
}>;

export const handleRouting = async ({
  request,
  env,
  appInit,
}: Input): Promise<RoutingResult<PublishedRegistry>> => {
  const pathname = new URL(request.url).pathname;

  const earlySystemRoute = checkSystemRouting({
    pathname,
    appInit,
    ledger: null,
  });

  if (earlySystemRoute) {
    return earlySystemRoute;
  }

  const ledger = await resolveJournalLedgerRouting({ env });

  const lateSystemRoute = checkSystemRouting({
    pathname,
    appInit,
    ledger,
  });

  if (lateSystemRoute) {
    return lateSystemRoute;
  }

  return matchRouting({
    pathname,
    appInit,
    ledger,
  });
};
