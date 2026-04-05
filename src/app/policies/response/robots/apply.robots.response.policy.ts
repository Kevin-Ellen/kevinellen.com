// src/app/policies/response/robots/apply.robots.response.policy.ts

import type { PageRobotsAuthored } from "@shared-types/content/pages/base.page.definition";
import type { ResponsePolicy } from "@app/policies/response/response.policies.types";

const getNonProductionRobotsHeader = (): string => {
  return "noindex, nofollow, noarchive, nosnippet, noimageindex";
};

const buildRobotsHeader = (robots: PageRobotsAuthored): string => {
  const directives: string[] = [
    robots.allowIndex ? "index" : "noindex",
    robots.allowFollow ? "follow" : "nofollow",
  ];

  if (robots.noarchive) {
    directives.push("noarchive");
  }

  if (robots.nosnippet) {
    directives.push("nosnippet");
  }

  if (robots.noimageindex) {
    directives.push("noimageindex");
  }

  return directives.join(", ");
};

const resolveRobotsHeader = (env: Env, robots: PageRobotsAuthored): string => {
  if (env.APP_ENV !== "prod") {
    return getNonProductionRobotsHeader();
  }

  return buildRobotsHeader(robots);
};

export const applyRobotsResponsePolicy: ResponsePolicy = (
  context,
  response,
): Response => {
  const robotsHeader = resolveRobotsHeader(
    context.env,
    context.target.page.config.robots,
  );

  const headers = new Headers(response.headers);
  headers.set("x-robots-tag", robotsHeader);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
