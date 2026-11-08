// src/app/types/document/page/header.page.document.app-render-context.type.ts

import type { SvgReferenceAppRenderContext } from "../../primitives/assets/svg/svg.asset.app-render-context.type";
import type { LinkAppRenderContext } from "../../primitives/link/link.primitive.app-render-context.type";

export type HeaderPageDocumentAppRenderContext = Readonly<{
  appearance: Readonly<{
    transparent: boolean;
    inverted: boolean;
  }>;

  brand: Readonly<{
    href: string;
    label: string;
    logo: SvgReferenceAppRenderContext;
  }>;

  navigation: Readonly<{
    primary: Readonly<{
      items: readonly LinkAppRenderContext[];
    }>;

    social: Readonly<{
      items: readonly LinkAppRenderContext[];
    }>;
  }>;
}>;
