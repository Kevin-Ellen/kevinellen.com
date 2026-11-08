// src/app/life-cycle/app-resolve/resolvers/shell/shell.resolver.app-resolve.ts

import type { ContentRegistryAppResolve } from "../../../../types/registries/content.registry.app-resolve.type";
import type { ShellAppResolve } from "../../../../types/document/shell.document.app-resolve.type";
import type { PagePresentationAppInit } from "../../../../../shared/types/content/content.shared.app-init.type";
import type { AppInit } from "../../../app-init/class.app-init";

import { resolveNavigationShellAppResolve } from "./navigation/navigation.shell.resolver.app-resolve";
import { resolveFooterShellAppResolve } from "./footer/footer.shell.resolver.app-resolve";

type Input = Readonly<{
  appInit: AppInit;
  contentRegistry: ContentRegistryAppResolve;
  pagePresentation: PagePresentationAppInit;
}>;

export const resolveShellAppResolve = ({
  appInit,
  contentRegistry,
  pagePresentation,
}: Input): ShellAppResolve => ({
  navigation: resolveNavigationShellAppResolve({
    navigation: appInit.navigation,
    registry: contentRegistry,
  }),

  footer: resolveFooterShellAppResolve({
    footer: appInit.footer,
    registry: contentRegistry,
  }),

  pagePresentation,
});
