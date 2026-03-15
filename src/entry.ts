// src/entry.ts

import type { RouteMap } from "@types-src/routes.types";

import handleApp from "@app/entry.app";
import handleRobots from "@system/robots.handler";
import handleXmlSitemap from "@system/xmlSitemap.handler";
import handleWebmanifest from "@system/webmanifest.handler";

const SYSTEM_ROUTE_MAP: RouteMap = {
  "/robots.txt": handleRobots,
  "/sitemap.xml": handleXmlSitemap,
  "/manifest.webmanifest": handleWebmanifest,
};

export default {
  async fetch(
    req: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    try {
      const path = new URL(req.url).pathname;
      const systemHandler = SYSTEM_ROUTE_MAP[path];

      if (systemHandler) {
        return systemHandler(req, env, ctx);
      }

      // return handleApp(req, env, ctx);
      return handleApp(req);
    } catch (error) {
      console.error("Unhandled request error", error);

      return new Response("Internal Server Error", {
        status: 500,
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      });
    }
  },
};
