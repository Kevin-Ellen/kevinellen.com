// src/app/entry.app.ts

import resolveAppRoute from "@app/router/app.router";
import documentRenderer from "@app/renderers/document.renderer";

import siteConfig from "@config/site.config";

import {
  getCanonicalRedirect,
  resolveRobotsHeader,
} from "@app/policies/request.policy";
import buildCspHeader from "@app/policies/csp.policy";

const handleApp = async (
  req: Request,
  env: Env,
  _ctx: ExecutionContext,
): Promise<Response> => {
  const redirectUrl = getCanonicalRedirect(req, env);

  if (redirectUrl) {
    return Response.redirect(redirectUrl, 308);
  }

  const url = new URL(req.url);
  const page = resolveAppRoute(url.pathname);
  const renderedDocument = documentRenderer(siteConfig, page);
  const cspHeader = await buildCspHeader(renderedDocument.inlineAssets);

  return new Response(renderedDocument.html, {
    status: page.status ?? 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "content-security-policy": cspHeader,
      "x-robots-tag": resolveRobotsHeader(page, env),
    },
  });
};

export default handleApp;
