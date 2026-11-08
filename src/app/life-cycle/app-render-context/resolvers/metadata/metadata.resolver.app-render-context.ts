// src/app/life-cycle/app-render-context/resolvers/metadata/metadata.resolver.app-render-context.ts

import type { MetadataAppRenderContext } from "../../../../types/document/metadata.document.app-render-context.type";

type Input = Readonly<{
  status: number;
}>;

export const resolveMetadataAppRenderContext = ({
  status,
}: Input): MetadataAppRenderContext => {
  const nonce = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))),
  );

  return {
    status,
    nonce,
  };
};
