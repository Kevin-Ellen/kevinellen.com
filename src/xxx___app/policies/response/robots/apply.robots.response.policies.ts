// src/app/policies/response/robots/apply.robots.response.policies.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";
import type { DocumentResponsePolicyContextInternal } from "@app/policies/response/response.policies.types";

import { isNonProductionEnvironment } from "@app/runtime/environment.runtime";

const NON_PROD_ROBOTS_DIRECTIVES =
  "noindex, nofollow, noarchive, nosnippet, noimageindex";

const buildRobotsDirectives = (
  context: DocumentResponsePolicyContextInternal,
): string | null => {
  if (isNonProductionEnvironment(context.env)) {
    return NON_PROD_ROBOTS_DIRECTIVES;
  }

  const directives: string[] = [];
  const robots = context.documentRender.robots;

  if (!robots.allowIndex) directives.push("noindex");
  if (!robots.allowFollow) directives.push("nofollow");
  if (robots.noarchive) directives.push("noarchive");
  if (robots.nosnippet) directives.push("nosnippet");
  if (robots.noimageindex) directives.push("noimageindex");

  return directives.length > 0 ? directives.join(", ") : null;
};

export const applyRobotsResponsePolicies = (
  context: ResponsePolicyContext,
): Response => {
  if (context.responseKind !== "document") {
    return context.response;
  }

  const directives = buildRobotsDirectives(context);

  if (!directives) {
    return context.response;
  }

  const headers = new Headers(context.response.headers);
  headers.set("x-robots-tag", directives);

  return new Response(context.response.body, {
    status: context.response.status,
    statusText: context.response.statusText,
    headers,
  });
};
