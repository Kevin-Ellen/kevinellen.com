// src/app/life-cycle/app-resolve/resolvers/shell/footer/footer.shell.resolver.app-resolve.ts

import type { FooterConfigAppInit } from "../../../../../types/config/footer/footer.config.app-init.type";
import type { FooterShellAppResolve } from "../../../../../types/config/footer/footer.config.app-resolve.type";
import type { ContentRegistryAppResolve } from "../../../../../types/registries/content.registry.app-resolve.type";

import { resolveLinkAppResolve } from "../../primitives/link/link.primitive.resolver.app-resolve";

type Input = Readonly<{
  footer: FooterConfigAppInit;
  registry: ContentRegistryAppResolve;
}>;

export const resolveFooterShellAppResolve = ({
  footer,
  registry,
}: Input): FooterShellAppResolve => ({
  conservation: {
    ...footer.conservation,
    conservations: footer.conservation.conservations.map((entry) => ({
      ...entry,
      link: resolveLinkAppResolve({
        link: entry.link,
        registry,
      }),
    })),
  },

  colophon: footer.colophon,
});
