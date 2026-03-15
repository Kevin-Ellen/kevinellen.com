// src/app/entry.app.ts

import resolveAppRoute from "@app.router/app.router";
import documentRenderer from "@app.renderers/document.renderer";

const handleApp = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  const page = resolveAppRoute(url.pathname);

  const html = documentRenderer(page);

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": page.noindex ? "noindex" : "index, follow",
    },
  });
};

export default handleApp;
