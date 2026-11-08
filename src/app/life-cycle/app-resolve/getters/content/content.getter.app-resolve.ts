// src/app/life-cycle/app-resolve/getters/content/content.getter.app-resolve.ts

import type { AppInit } from "../../../app-init/class.app-init";
import type { ValidatedEnv } from "../../../../entry.type";
import type { RoutingResult } from "../../../../types/routing/routing.shared.type";
import type { ContentRegistryAppResolve } from "../../../../types/registries/content.registry.app-resolve.type";
import type { PublishedRegistry } from "../../../../../shared/types/content/kv-ledger.content.shared.type";

import { getBundledContentAppResolve } from "./bundled/bundled.content.getter.app-resolve";
import { getKvContentAppResolve } from "./kv/kv.content.getter.app-resolve";

type ContentRoutingResult = Extract<
  RoutingResult<PublishedRegistry>,
  { kind: "selected" | "not-found" }
>;

type SelectedRoutingResult = Extract<
  ContentRoutingResult,
  { kind: "selected" }
>;

type GetContentAppResolveInput = Readonly<{
  appInit: AppInit;
  routing: ContentRoutingResult;
  env: ValidatedEnv;
  contentRegistry: ContentRegistryAppResolve;
}>;

type GetContentAppResolveResult = Awaited<
  ReturnType<typeof getBundledContentAppResolve>
>;

type SelectedGetterInput = Readonly<{
  appInit: AppInit;
  routing: SelectedRoutingResult;
  env: ValidatedEnv;
  contentRegistry: ContentRegistryAppResolve;
}>;

type ContentGetter = (
  input: SelectedGetterInput,
) => GetContentAppResolveResult | Promise<GetContentAppResolveResult>;

const getterLibrary: Record<SelectedRoutingResult["source"], ContentGetter> = {
  bundled: ({ appInit, routing }) =>
    getBundledContentAppResolve({
      appInit,
      slug: routing.contentPathname,
    }),

  published: async ({ appInit, routing, env, contentRegistry }) => {
    const entry = contentRegistry.bySlug[routing.contentPathname];

    if (!entry || entry.source !== "published") {
      return getBundledContentAppResolve({
        appInit,
        status: 404,
      });
    }

    const result = await getKvContentAppResolve({
      kv: env.CONTENT_KV,
      key: `journal:appInit:${entry.id}`,
      expectedId: entry.id,
      expectedSlug: routing.contentPathname,
    });

    if (result.kind === "not-found") {
      return getBundledContentAppResolve({
        appInit,
        status: 404,
      });
    }

    return result.content;
  },
};

export const getContentAppResolve = async ({
  appInit,
  routing,
  env,
  contentRegistry,
}: GetContentAppResolveInput): Promise<GetContentAppResolveResult> => {
  if (routing.kind === "not-found") {
    return getBundledContentAppResolve({
      appInit,
      status: routing.status,
    });
  }

  return getterLibrary[routing.source]({
    appInit,
    routing,
    env,
    contentRegistry,
  });
};
