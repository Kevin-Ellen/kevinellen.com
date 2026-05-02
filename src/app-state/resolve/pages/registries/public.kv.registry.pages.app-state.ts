// src/app-state/resolve/pages/registries/public.kv.registry.pages.app-state.ts

import type { AuthoredPublicPageDefinition } from "@shared-types/page-definitions/authored.public.page-definition.types";

const KV_PUBLIC_PAGE_KEY_PREFIX = "page:";

type PublicKvPageRegistryLoaderArgs = Readonly<{
  kv: KVNamespace;
}>;

const isAuthoredPublicPageDefinition = (
  value: unknown,
): value is AuthoredPublicPageDefinition => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<AuthoredPublicPageDefinition>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.kind === "string" &&
    typeof candidate.slug === "string" &&
    typeof candidate.label === "string" &&
    typeof candidate.metadata === "object" &&
    candidate.metadata !== null &&
    (candidate.breadcrumbs === undefined ||
      Array.isArray(candidate.breadcrumbs)) &&
    typeof candidate.content === "object" &&
    candidate.content !== null
  );
};

export const loadKvPublicPageRegistry = async ({
  kv,
}: PublicKvPageRegistryLoaderArgs): Promise<
  readonly AuthoredPublicPageDefinition[]
> => {
  const listedKeys = await kv.list({
    prefix: KV_PUBLIC_PAGE_KEY_PREFIX,
  });

  const pages = await Promise.all(
    listedKeys.keys.map(async ({ name }) => {
      const value = await kv.get(name, "json");

      if (!isAuthoredPublicPageDefinition(value)) {
        return null;
      }

      return value;
    }),
  );

  return pages.filter(
    (page): page is AuthoredPublicPageDefinition => page !== null,
  );
};
