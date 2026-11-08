// src/app/life-cycle/response/response.ts

import type {
  ResponseInput,
  ResponseOutput,
} from "../../types/response/response.shared.type";

import { handleRejectionResponse } from "./rejection/rejection.response";
import { handleRedirectResponse } from "./redirect/redirect.response";
import { handleJsonResponse } from "./json/json.response";
import { handleTextResponse } from "./text/text.response";
import { handleHtmlResponse } from "./html/html.response";
import { handleXmlResponse } from "./xml/xml.response";

type Input = Readonly<{
  result: ResponseInput;
}>;

type DocumentHandler = (
  input: Readonly<{ document: ResponseOutput }>,
) => Response;

const documentHandlers: Record<ResponseOutput["kind"], DocumentHandler> = {
  json: ({ document }) =>
    handleJsonResponse({
      document: document as Extract<ResponseOutput, { kind: "json" }>,
    }),

  txt: ({ document }) =>
    handleTextResponse({
      document: document as Extract<ResponseOutput, { kind: "txt" }>,
    }),

  html: ({ document }) =>
    handleHtmlResponse({
      document: document as Extract<ResponseOutput, { kind: "html" }>,
    }),

  xml: ({ document }) =>
    handleXmlResponse({
      document: document as Extract<ResponseOutput, { kind: "xml" }>,
    }),

  redirect: ({ document }) =>
    handleRedirectResponse({
      document: document as Extract<ResponseOutput, { kind: "redirect" }>,
    }),
};

export const handleResponse = ({ result }: Input): Response => {
  if ("ok" in result) {
    return handleRejectionResponse({ result });
  }

  const handler = documentHandlers[result.kind];

  if (!handler) {
    throw new Error(`Unsupported response kind: ${result.kind}`);
  }

  return handler({ document: result });
};
