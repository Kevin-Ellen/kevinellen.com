// src/app/policies/request.policy.ts

import type { AppPage } from "@types-src/appPage.types";
import { MethodNotAllowedError } from "../errors/http.errors";

export const isProd = (env: Env): boolean => {
  if (!env.APP_ENV) {
    throw new Error("APP_ENV not defined");
  }

  return env.APP_ENV === "prod";
};

export const getCanonicalRedirect = (req: Request, env: Env): string | null => {
  if (!isProd(env)) {
    return null;
  }

  const url = new URL(req.url);

  if (!url.hostname.startsWith("www.")) {
    return null;
  }

  url.hostname = url.hostname.replace(/^www\./, "");

  return url.toString();
};

export const resolveRobotsHeader = (page: AppPage, env: Env): string => {
  if (!isProd(env)) {
    return "noindex, nofollow";
  }

  const directives: string[] = [
    page.config.robots.allowIndex ? "index" : "noindex",
    page.config.robots.allowFollow ? "follow" : "nofollow",
  ];

  if (page.config.robots.noarchive) {
    directives.push("noarchive");
  }

  if (page.config.robots.nosnippet) {
    directives.push("nosnippet");
  }

  if (page.config.robots.noimageindex) {
    directives.push("noimageindex");
  }

  return directives.join(", ");
};

export const assertAllowedMethod = (req: Request): void => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    throw new MethodNotAllowedError(req.method);
  }
};
