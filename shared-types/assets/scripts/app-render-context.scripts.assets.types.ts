// shared-types/assets/scripts/app-render-context.scripts.assets.types.ts

export type AppRenderContextInlineScript = Readonly<{
  content: string;
  nonce: string;
}>;

export type AppRenderContextLinkScript = Readonly<{
  src: string;
  nonce: string;
  loading: "blocking" | "defer" | "async";
}>;
