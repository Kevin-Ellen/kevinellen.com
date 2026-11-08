// src/app/life-cycle/app-resolve/resolvers/content/breadcrumbs/breadcrumbs.content.resolver.app-resolve.ts

import type { ContentAppInit } from "../../../../../../shared/types/content/content.shared.app-init.type";
import type { LinkAppInit } from "../../../../../../shared/types/content/primitives/link.primitive.content.shared.app-init.type";
import type { LinkAppResolve } from "../../../../../types/primitives/link/link.primitive.app-resolve.type";
import type { ContentRegistryAppResolve } from "../../../../../types/registries/content.registry.app-resolve.type";

import { resolveLinkAppResolve } from "../../primitives/link/link.primitive.resolver.app-resolve";

type Input = Readonly<{
  breadcrumbs: ContentAppInit["breadcrumbs"];
  contentRegistry: ContentRegistryAppResolve;
}>;

export const resolveContentBreadcrumbsAppResolve = ({
  breadcrumbs,
  contentRegistry,
}: Input): readonly LinkAppResolve[] =>
  breadcrumbs.map((pageId) => {
    const link: LinkAppInit = {
      kind: "internal",
      pageId,
      label: null,
      ariaLabel: null,
      title: null,
      icon: null,
      target: null,
      rel: null,
      variant: null,
    };

    return resolveLinkAppResolve({
      link,
      registry: contentRegistry,
    });
  });
