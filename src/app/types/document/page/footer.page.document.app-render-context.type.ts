// src/app/types/document/page/footer.page.document.app-render-context.type.ts

import type { LinkAppRenderContext } from "../../primitives/link/link.primitive.app-render-context.type";

export type FooterPageDocumentAppRenderContext = Readonly<{
  navigation: readonly Readonly<{
    id: string;
    label: string;
    links: readonly LinkAppRenderContext[];
  }>[];

  conservation: Readonly<{
    heading: string;
    items: readonly Readonly<{
      id: string;
      link: LinkAppRenderContext;
    }>[];
  }>;

  colophon: Readonly<{
    rights: string;
    year: number;
    name: string;
  }>;

  legal: Readonly<{
    label: string;
    links: readonly LinkAppRenderContext[];
  }>;
}>;
