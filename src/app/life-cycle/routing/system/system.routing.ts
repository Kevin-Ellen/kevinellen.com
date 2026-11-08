// src/app/life-cycle/routing/system/system.routing.ts

import type { RoutingSystemResult } from "../../../types/routing/routing.shared.type";
import type { AppInit } from "../../app-init/class.app-init";

type Input<TLedger> = Readonly<{
  pathname: string;
  appInit: AppInit;
  ledger: TLedger | null;
}>;

export const checkSystemRouting = <TLedger>({
  pathname,
  appInit,
  ledger,
}: Input<TLedger>): RoutingSystemResult<TLedger> | null => {
  if (pathname === "/robots.txt") {
    return {
      kind: "system",
      resolver: "robots-txt",
      ledger: null,
    };
  }

  if (pathname === appInit.site.manifest) {
    return {
      kind: "system",
      resolver: "webmanifest",
      ledger: null,
    };
  }

  if (pathname === "/sitemap.xml" && ledger !== null) {
    return {
      kind: "system",
      resolver: "sitemap",
      ledger,
    };
  }

  return null;
};
