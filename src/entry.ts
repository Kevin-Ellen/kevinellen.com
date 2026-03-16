import type { RouteMap } from "@types-src/routes.types";

import handleApp from "@app/entry.app";
import handleRobots from "@system/robots.handler";
import handleXmlSitemap from "@system/xmlSitemap.handler";
import handleWebmanifest from "@system/webmanifest.handler";
import handlePhotoResource from "@resources/photoResource.handler";

import error500Page from "@app/pages/error/error.500.page";
import documentRenderer from "@app/renderers/document.renderer";
import siteConfig from "@config/site.config";
import buildCspHeader from "@app/policies/csp.policy";
import { assertAllowedMethod } from "@app/policies/request.policy";
import { MethodNotAllowedError } from "@app/errors/http.errors";

const SYSTEM_ROUTE_MAP: RouteMap = {
  "/robots.txt": handleRobots,
  "/sitemap.xml": handleXmlSitemap,
  "/manifest.webmanifest": handleWebmanifest,
};

const isPhotoResourcePath = (pathname: string): boolean => {
  return pathname.startsWith("/photo/");
};

export default {
  async fetch(
    req: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    try {
      assertAllowedMethod(req);

      const url = new URL(req.url);
      const pathname = url.pathname;
      const systemHandler = SYSTEM_ROUTE_MAP[pathname];

      if (systemHandler) {
        return await systemHandler(req, env, ctx);
      }

      if (isPhotoResourcePath(pathname)) {
        return await handlePhotoResource(req, env, ctx);
      }

      if (env.APP_ENV !== "prod" && url.searchParams.has("__500")) {
        throw new Error("Forced 500 for testing");
      }

      return await handleApp(req, env, ctx);
    } catch (error) {
      if (error instanceof MethodNotAllowedError) {
        return new Response("Method Not Allowed", {
          status: error.status,
          headers: {
            Allow: error.allow,
            "content-type": "text/plain; charset=utf-8",
            "x-robots-tag": "noindex, nofollow",
          },
        });
      }

      console.error("Unhandled request error", error);

      const renderedDocument = documentRenderer(siteConfig, error500Page);
      const cspHeader = await buildCspHeader(renderedDocument.inlineAssets);

      return new Response(renderedDocument.html, {
        status: error500Page.status,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "x-robots-tag": "noindex, nofollow",
          "content-security-policy": cspHeader,
        },
      });
    }
  },
};
