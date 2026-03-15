// src/app/router/app.router.ts

import type { AppPage, AppRouteMap } from "@types-src/appPage.types";

import homePage from "@app.pages/home.page";
import aboutPage from "@app.pages/about.page";
import journalPage from "@app.pages/journal.page";
import notFoundPage from "@app.pages/notFound.page";

const APP_ROUTE_MAP: AppRouteMap = {
  "/": homePage,
  "/about": aboutPage,
  "/journal": journalPage,
};

const resolveAppRoute = (path: string): AppPage => {
  return APP_ROUTE_MAP[path] ?? notFoundPage;
};

export default resolveAppRoute;
