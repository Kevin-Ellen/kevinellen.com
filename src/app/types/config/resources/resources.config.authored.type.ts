// src/app/types/config/resources/resources.config.authored.type.ts

export type ResourcePreloadAuthored = Readonly<{
  href: string;
  as: "font" | "image" | "style" | "script" | "fetch";
  type?: string;
  crossorigin?: "anonymous" | "use-credentials";
}>;

export type ResourcesConfigAuthored = Readonly<{
  preloads: readonly ResourcePreloadAuthored[];
}>;
