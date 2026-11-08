// src/app/life-cycle/app-render-context/resolvers/document/page/header/header.page.document.resolver.app-render-context.ts

import type { ShellAppResolve } from "../../../../../../types/document/shell.document.app-resolve.type";
import type { HeaderPageDocumentAppRenderContext } from "../../../../../../types/document/page/header.page.document.app-render-context.type";

import { resolveLinkAppRenderContext } from "../../../primitives/link/link.primitive.resolver.app-render-context";

type Input = Readonly<{
  shell: ShellAppResolve;
}>;

export const resolveHeaderPageDocumentAppRenderContext = ({
  shell,
}: Input): HeaderPageDocumentAppRenderContext => {
  const logo = shell.navigation.branding.icon;
  const label =
    shell.navigation.branding.ariaLabel ?? shell.navigation.branding.label;

  if (!logo) {
    throw new Error("Header branding requires an icon");
  }

  if (!label) {
    throw new Error("Header branding requires a label");
  }

  return {
    appearance: shell.pagePresentation.header,

    brand: {
      href: shell.navigation.branding.href,
      logo,
      label,
    },

    navigation: {
      primary: {
        items: shell.navigation.primary.map((link) =>
          resolveLinkAppRenderContext({ link }),
        ),
      },

      social: {
        items: shell.navigation.social.map((link) =>
          resolveLinkAppRenderContext({ link }),
        ),
      },
    },
  };
};
