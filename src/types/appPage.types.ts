// src/types/appPage.types.ts

export type AppPage = {
  id: string;
  title: string;
  content: string;
  noindex: boolean;
};

export type AppRouteMap = Record<string, AppPage>;
