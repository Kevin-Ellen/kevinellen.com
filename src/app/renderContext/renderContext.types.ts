// src/app/renderContext/renderContext.types.ts

export type RenderContextPage = {
  id: string;
  kind: string;
  label: string;
};

export type RenderContextMetadata = {
  canonicalUrl: string | null;
};

export type RenderContextSecurity = {
  nonce: string;
};

export type RenderContextInput = {
  status: number;
  page: RenderContextPage;
  metadata: RenderContextMetadata;
  security: RenderContextSecurity;
};

export type RenderContextInspect = {
  status: number;
  page: RenderContextPage;
  metadata: RenderContextMetadata;
  security: RenderContextSecurity;
};
