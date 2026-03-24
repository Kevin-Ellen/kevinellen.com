// src/app/policies/response/robots/apply.robots.response.policies.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";

import { getRuntimeBehaviour } from "@utils/runtimeEnv.util";

const NON_INDEXABLE_ROBOTS_DIRECTIVES =
  "noindex, nofollow, noarchive, nosnippet, noimageindex";

const resolveRobotsDirectives = (
  context: ResponsePolicyContext,
): string | null => {
  const runtime = getRuntimeBehaviour(context.appContext.getEnv());

  if (!runtime.indexing) {
    return NON_INDEXABLE_ROBOTS_DIRECTIVES;
  }

  const doc = context.appContext.getDocument();
  return doc?.robots ?? null;
};

export const applyRobotsResponsePolicies = (
  context: ResponsePolicyContext,
): Response => {
  if (context.appContext.getResponseKind() !== "document") {
    return context.response;
  }

  const directives = resolveRobotsDirectives(context);

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
