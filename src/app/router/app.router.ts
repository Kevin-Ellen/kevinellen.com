// src/app/router/app.router.ts

import type { AppPage, AppRouteMap } from "@types-src/appPage.types";

import homePage from "@app/pages/home.page";
import aboutPage from "@app/pages/about.page";
import journalPage from "@app/pages/journal.page";
import error404page from "@app/pages/error/error.404.page";

const APP_ROUTE_MAP: AppRouteMap = {
  "/": homePage,
  "/about": aboutPage,
  "/journal": journalPage,
};

const resolveAppRoute = (path: string): AppPage => {
  const staticPage = APP_ROUTE_MAP[path];

  if (staticPage) {
    return staticPage;
  }

  const journalPage = resolveJournalRoute(path);

  if (journalPage) {
    return journalPage;
  }

  const photoPage = resolvePhotoRoute(path);

  if (photoPage) {
    return photoPage;
  }

  return error404page;
};

export default resolveAppRoute;

const resolveJournalRoute = (_path: string): AppPage | null => {
  return null;
};

const resolvePhotoRoute = (_path: string): AppPage | null => {
  return null;
};
