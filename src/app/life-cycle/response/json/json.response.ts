// src/app/life-cycle/response/json/json.response.ts

import type { JsonResponseOutput } from "../../../types/response/response.shared.type";

type Input = Readonly<{
  document: JsonResponseOutput;
}>;

export const handleJsonResponse = ({ document }: Input): Response => {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
  });

  new Headers(document.headers).forEach((value, key) => {
    headers.set(key, value);
  });

  return new Response(document.body, {
    status: document.status,
    headers,
  });
};
