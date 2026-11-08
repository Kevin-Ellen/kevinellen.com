// src/app/life-cycle/response/text/text.response.ts

import type { TextResponseOutput } from "../../../types/response/response.shared.type";

type Input = Readonly<{
  document: TextResponseOutput;
}>;

export const handleTextResponse = ({ document }: Input): Response => {
  const headers = new Headers({
    "Content-Type": "text/plain; charset=utf-8",
  });

  new Headers(document.headers).forEach((value, key) => {
    headers.set(key, value);
  });

  return new Response(document.body, {
    status: document.status,
    headers,
  });
};
