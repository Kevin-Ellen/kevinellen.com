// src/app/types/request/request.shared.type.ts

import type { RedirectStatus } from "../system/redirects.system.type";

export type RequestAccepted = Readonly<{
  ok: true;
  request: Request;
}>;

export type RequestRejected = Readonly<{
  ok: false;
  reason: "METHOD_NOT_ALLOWED";
  status?: number;
  location?: string;
}>;

export type RequestRedirect = Readonly<{
  ok: false;
  reason: "REDIRECT";
  status: RedirectStatus;
  location: string;
}>;

export type RequestResult = RequestAccepted | RequestRejected | RequestRedirect;
