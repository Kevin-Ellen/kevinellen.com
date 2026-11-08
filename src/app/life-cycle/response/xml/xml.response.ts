// src/app/life-cycle/response/xml/xml.response.ts

import type { XmlResponseOutput } from "../../../types/response/response.shared.type";

type Input = Readonly<{
  document: XmlResponseOutput;
}>;

export const handleXmlResponse = ({ document }: Input): Response => {
  const headers = new Headers({
    "Content-Type": "application/xml; charset=utf-8",
  });

  new Headers(document.headers).forEach((value, key) => {
    headers.set(key, value);
  });

  headers.set("Cache-Control", "no-store");

  return new Response(document.body, {
    status: document.status,
    headers,
  });
};
