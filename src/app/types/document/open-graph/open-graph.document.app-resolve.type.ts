// src/app/types/document/open-graph/open-graph.document.app-resolve.type.ts

export type OpenGraphAppResolve = Readonly<{
  type: "website" | "article";
  title: string;
  description: string;
  language: string;
  url: string;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
}>;
