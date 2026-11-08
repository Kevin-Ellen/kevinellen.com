// src/app/life-cycle/response/redirect/redirect.response.ts

import type { RedirectResponseOutput } from "../../../types/response/response.shared.type";

type Input = Readonly<{
  document: RedirectResponseOutput;
}>;

export const handleRedirectResponse = ({ document }: Input): Response =>
  Response.redirect(document.location, document.status);
