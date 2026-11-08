// src/app/types/routing/routing.shared.type.ts

import type { SystemResolverId } from "../system/system.shared.type";

export type RoutingSystemResult<TLedger> = Readonly<{
  kind: "system";
  resolver: SystemResolverId;
  ledger: TLedger | null;
}>;

export type RoutingSelectedResult<TLedger> = Readonly<{
  kind: "selected";
  pathname: string;
  contentPathname: string;
  pagination?: Readonly<{
    page: number;
  }>;
  source: "bundled" | "published";
  ledger: TLedger;
}>;

export type RoutingNotFoundResult<TLedger> = Readonly<{
  kind: "not-found";
  status: 404;
  pathname: string;
  ledger: TLedger;
}>;

export type RoutingFailureResult = Readonly<{
  kind: "failure";
  status: number;
  message: string;
}>;

export type RoutingResult<TLedger> =
  | RoutingSystemResult<TLedger>
  | RoutingSelectedResult<TLedger>
  | RoutingNotFoundResult<TLedger>
  | RoutingFailureResult;
