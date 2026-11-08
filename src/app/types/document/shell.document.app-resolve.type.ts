// src/app/types/document/shell.document.app-resolve.type.ts

import type { NavigationShellAppResolve } from "../config/navigation/navigation.config.app-resolve.type";
import type { FooterShellAppResolve } from "../config/footer/footer.config.app-resolve.type";
import type { PagePresentationAppInit } from "../../../shared/types/content/content.shared.app-init.type";

export type ShellAppResolve = Readonly<{
  navigation: NavigationShellAppResolve;
  footer: FooterShellAppResolve;
  pagePresentation: PagePresentationAppInit;
}>;
