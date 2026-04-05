// src/app/renderContext/renderContext.types.ts

import type {
  AppContextBreadcrumb,
  AppContextMetadata,
  AppContextNavigation,
  AppContextPage,
} from "@app/appContext/appContext.types";

export type RenderContextDocument = {
  status: number;
  language: string;
  siteName: string;
};

export type RenderContextPage = {
  id: AppContextPage["core"]["id"];
  kind: AppContextPage["core"]["kind"];
  label: string;
  title: string;
  description: string;
};

export type RenderContextSecurity = {
  nonce: string;
};

export type RenderContextInput = {
  document: RenderContextDocument;
  page: RenderContextPage;
  metadata: AppContextMetadata;
  breadcrumbs: readonly AppContextBreadcrumb[];
  navigation: AppContextNavigation;
  security: RenderContextSecurity;
};

export type RenderContextInspect = {
  document: RenderContextDocument;
  page: RenderContextPage;
  metadata: AppContextMetadata;
  breadcrumbs: readonly AppContextBreadcrumb[];
  navigation: AppContextNavigation;
  security: RenderContextSecurity;
};
