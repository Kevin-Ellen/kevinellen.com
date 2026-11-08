// src/app/life-cycle/app-render-context/resolvers/document/page/footer/footer.page.document.resolver.app-render-context.ts

import type { ShellAppResolve } from "../../../../../../types/document/shell.document.app-resolve.type";
import type { FooterPageDocumentAppRenderContext } from "../../../../../../types/document/page/footer.page.document.app-render-context.type";

import { resolveLinkAppRenderContext } from "../../../primitives/link/link.primitive.resolver.app-render-context";

type Input = Readonly<{
  shell: ShellAppResolve;
}>;

export const resolveFooterPageDocumentAppRenderContext = ({
  shell,
}: Input): FooterPageDocumentAppRenderContext => ({
  navigation: shell.navigation.footer.primary.map((section) => ({
    id: section.id,
    label: section.label,
    links: section.links.map((link) => resolveLinkAppRenderContext({ link })),
  })),

  conservation: {
    heading: shell.footer.conservation.heading,
    items: shell.footer.conservation.conservations.map((item) => ({
      id: item.id,
      link: resolveLinkAppRenderContext({ link: item.link }),
    })),
  },

  colophon: shell.footer.colophon,

  legal: {
    label: shell.navigation.footer.legal.label,
    links: shell.navigation.footer.legal.links.map((link) =>
      resolveLinkAppRenderContext({ link }),
    ),
  },
});
