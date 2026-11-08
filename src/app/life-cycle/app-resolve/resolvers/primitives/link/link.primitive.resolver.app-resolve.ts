// src/app/life-cycle/app-resolve/resolvers/primitives/link/link.primitive.resolver.app-resolve.ts

import type { LinkAppInit } from "../../../../../../shared/types/content/primitives/link.primitive.content.shared.app-init.type";
import type { LinkAppResolve } from "../../../../../types/primitives/link/link.primitive.app-resolve.type";
import type { ContentRegistryAppResolve } from "../../../../../types/registries/content.registry.app-resolve.type";

type Input = Readonly<{
  link: LinkAppInit;
  registry: ContentRegistryAppResolve;
}>;

export const resolveLinkAppResolve = ({
  link,
  registry,
}: Input): LinkAppResolve => {
  if (link.kind === "external") {
    const { kind: _kind, target: _target, rel: _rel, ...resolved } = link;

    return {
      ...resolved,
      target: "_blank",
      rel: ["noopener"],
    };
  }

  const { kind: _kind, pageId, ...resolved } = link;

  const page = Object.values(registry.bySlug).find(
    (entry) => entry.id === pageId,
  );

  if (!page) {
    throw new Error(`Unable to resolve internal link: ${pageId}`);
  }

  return {
    ...resolved,
    href: page.slug,
    label: link.label ?? page.label,
  };
};
