// src/app/life-cycle/app-resolve/getters/content/kv/kv.content.getter.app-resolve.ts

import type { AppInit } from "../../../../app-init/class.app-init";

type PublishedContentAppInit = AppInit["content"]["bySlug"][string];

type Input = Readonly<{
  kv: KVNamespace;
  key: string;
  expectedId: string;
  expectedSlug: string;
}>;

type GetKvContentAppResolveResult =
  | Readonly<{
      kind: "found";
      content: PublishedContentAppInit;
    }>
  | Readonly<{
      kind: "not-found";
      status: 404;
    }>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasValidEnvelope = (
  value: unknown,
  expectedId: string,
  expectedSlug: string,
): boolean => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.kind === "public" &&
    value.id === expectedId &&
    value.slug === expectedSlug &&
    value.status === 200 &&
    isRecord(value.metadata) &&
    typeof value.metadata.title === "string" &&
    typeof value.metadata.description === "string" &&
    typeof value.metadata.sitemap === "boolean" &&
    isRecord(value.dates) &&
    typeof value.dates.created === "string" &&
    (value.dates.lastUpdated === null ||
      typeof value.dates.lastUpdated === "string") &&
    isRecord(value.body)
  );
};

export const getKvContentAppResolve = async ({
  kv,
  key,
  expectedId,
  expectedSlug,
}: Input): Promise<GetKvContentAppResolveResult> => {
  const content = await kv.get<unknown>(key, "json");

  if (content === null) {
    return {
      kind: "not-found",
      status: 404,
    };
  }

  if (!hasValidEnvelope(content, expectedId, expectedSlug)) {
    throw new Error(`Invalid published content in KV: ${key}`);
  }

  // The envelope and registry identity have been checked here.
  // The full nested content structure is guaranteed by the
  // validated publishing contract, not by this runtime guard.
  return {
    kind: "found",
    content: content as PublishedContentAppInit,
  };
};
