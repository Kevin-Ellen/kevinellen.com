// src/app/life-cycle/request/request.ts

import type { ValidatedEnv } from "../../entry.type";
import type { RequestResult } from "../../types/request/request.shared.type";

import { requestConfig } from "./config.request";
import { validateMethod } from "./method/method.request";
import { resolveRedirect } from "./redirects/redirects.request";
import { resolveCanonical } from "./canonical/canonical.request";

type Input = Readonly<{
  request: Request;
  env: ValidatedEnv;
}>;

export const handleRequest = ({ request, env }: Input): RequestResult => {
  const methodResult = validateMethod({
    request,
    allowedMethods: requestConfig.allowedMethods,
  });

  if (methodResult) {
    return methodResult;
  }

  const original = new URL(request.url);

  const redirectResult = resolveRedirect({
    original,
    redirects: requestConfig.redirects,
    defaultStatus: requestConfig.defaultRedirectStatus,
  });

  const canonicalUrl = redirectResult?.external
    ? redirectResult.url
    : resolveCanonical({
        url: redirectResult?.url ?? original,
        domain: env.DOMAIN,
        config: requestConfig,
      });

  if (canonicalUrl.href !== original.href) {
    return {
      ok: false,
      reason: "REDIRECT",
      status: redirectResult?.status ?? requestConfig.defaultRedirectStatus,
      location: canonicalUrl.href,
    };
  }

  return {
    ok: true,
    request,
  };
};
