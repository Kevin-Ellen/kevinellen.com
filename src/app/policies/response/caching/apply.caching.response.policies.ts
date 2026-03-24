// src/app/policies/response/caching/apply.caching.response.policies.ts

import type { ResponsePolicyContext } from "@app/policies/response/response.policies.types";
import { getRuntimeBehaviour } from "@utils/runtimeEnv.util";

const CACHE_NO_STORE = "no-store";

/**
 * Short cache for staging public testing
 * Prevents aggressive browser caching during QA
 */
const CACHE_PUBLIC_STG =
  "public, max-age=60, s-maxage=300, stale-while-revalidate=600";

/**
 * Real production caching
 * Browser short, edge long
 */
const CACHE_PUBLIC_PROD =
  "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800";

export const applyCachingResponsePolicies = (
  context: ResponsePolicyContext,
): Response => {
  if (context.appContext.getResponseKind() !== "document") {
    return context.response;
  }

  const runtime = getRuntimeBehaviour(context.appContext.getEnv());
  const headers = new Headers(context.response.headers);

  /**
   * Future-safe:
   * Error documents must never be cached
   */
  const isErrorDocument = context.response.status >= 400;

  if (!runtime.public || isErrorDocument) {
    headers.set("cache-control", CACHE_NO_STORE);
  } else if (!runtime.indexing) {
    /**
     * Staging public environment
     */
    headers.set("cache-control", CACHE_PUBLIC_STG);
  } else {
    /**
     * Production public environment
     */
    headers.set("cache-control", CACHE_PUBLIC_PROD);
  }

  return new Response(context.response.body, {
    status: context.response.status,
    statusText: context.response.statusText,
    headers,
  });
};
