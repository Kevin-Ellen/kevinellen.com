// src/app/types/response/response.shared.type.ts

import type { RedirectStatus } from "../system/redirects.system.type";
import type { RequestRejected } from "../request/request.shared.type";

export type ResponseKind = "txt" | "json" | "html" | "xml" | "redirect";

type ResponseBase = Readonly<{
  status: number;
  headers?: HeadersInit;
}>;

export type TextResponseOutput = ResponseBase &
  Readonly<{
    kind: "txt";
    headers?: HeadersInit;
    body: string;
  }>;

export type JsonResponseOutput = ResponseBase &
  Readonly<{
    kind: "json";
    headers?: HeadersInit;
    body: string;
  }>;

export type HtmlResponseOutput = ResponseBase &
  Readonly<{
    kind: "html";
    headers?: HeadersInit;
    nonce: string;
    body: string;
  }>;

export type XmlResponseOutput = ResponseBase &
  Readonly<{
    kind: "xml";
    headers?: HeadersInit;
    body: string;
  }>;

export type RedirectResponseOutput = Readonly<{
  kind: "redirect";
  status: RedirectStatus;
  location: string;
}>;

export type ResponseInput = RequestRejected | ResponseOutput;

export type ResponseOutput =
  | TextResponseOutput
  | JsonResponseOutput
  | HtmlResponseOutput
  | XmlResponseOutput
  | RedirectResponseOutput;
