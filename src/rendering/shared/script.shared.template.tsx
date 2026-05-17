// src/rendering/shared/script.shared.template.tsx

import type { AppRenderContextStructuredDataEntry } from "@shared-types/structured-data/app-render-context.structured-data.types";

import { escapeJsonScriptContent } from "@rendering/utils/html.escape.util.renderer";

type StructuredDataScriptProps = Readonly<{
  item: AppRenderContextStructuredDataEntry;
}>;

type InlineScriptProps = Readonly<{
  script: Readonly<{
    content: string;
    nonce?: string | null;
  }>;
}>;

type LinkScriptProps = Readonly<{
  script: Readonly<{
    src: string;
    nonce?: string | null;
    loading?: "blocking" | "defer" | "async";
  }>;
}>;

export const StructuredDataScript = ({ item }: StructuredDataScriptProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: escapeJsonScriptContent(JSON.stringify(item)),
    }}
  />
);

export const InlineScript = ({ script }: InlineScriptProps) => (
  <script
    nonce={script.nonce ?? undefined}
    dangerouslySetInnerHTML={{
      __html: script.content,
    }}
  />
);

export const LinkScript = ({ script }: LinkScriptProps) => (
  <script
    src={script.src}
    nonce={script.nonce ?? undefined}
    defer={script.loading === "defer" ? true : undefined}
    async={script.loading === "async" ? true : undefined}
  />
);
