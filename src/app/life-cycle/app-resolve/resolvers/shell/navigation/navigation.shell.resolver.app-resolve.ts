// src/app/life-cycle/app-resolve/resolvers/shell/navigation/navigation.shell.resolver.app-resolve.ts

import type { NavigationConfigAppInit } from "../../../../../types/config/navigation/navigation.config.app-init.type";
import type { NavigationShellAppResolve } from "../../../../../types/config/navigation/navigation.config.app-resolve.type";
import type { ContentRegistryAppResolve } from "../../../../../types/registries/content.registry.app-resolve.type";

import { resolveLinkAppResolve } from "../../primitives/link/link.primitive.resolver.app-resolve";

type Input = Readonly<{
  navigation: NavigationConfigAppInit;
  registry: ContentRegistryAppResolve;
}>;

export const resolveNavigationShellAppResolve = ({
  navigation,
  registry,
}: Input): NavigationShellAppResolve => ({
  branding: resolveLinkAppResolve({
    link: navigation.branding,
    registry,
  }),

  primary: navigation.primary.map((link) =>
    resolveLinkAppResolve({ link, registry }),
  ),

  social: navigation.social.map((link) =>
    resolveLinkAppResolve({ link, registry }),
  ),

  footer: {
    primary: navigation.footer.primary.map((section) => ({
      ...section,
      links: section.links.map((link) =>
        resolveLinkAppResolve({ link, registry }),
      ),
    })),

    legal: {
      ...navigation.footer.legal,
      links: navigation.footer.legal.links.map((link) =>
        resolveLinkAppResolve({ link, registry }),
      ),
    },
  },
});
