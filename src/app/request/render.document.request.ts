// src/app/request/render.document.request.ts

import type { AppState } from "@app/appState/class.appState";
import type { DocumentRenderTarget } from "@app/request/request.document.types";

export type RenderedDocumentResponse = {
  security: {
    nonce: string;
  };
  response: Response;
};

const createNonce = (): string => {
  return crypto.randomUUID().replaceAll("-", "");
};

export const renderDocumentRequest = async (
  _req: Request,
  _env: Env,
  _ctx: ExecutionContext,
  _appState: AppState,
  target: DocumentRenderTarget,
): Promise<RenderedDocumentResponse> => {
  const nonce = createNonce();

  const html = `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8">
    <title>${target.page.meta.pageTitle}</title>
    <meta name="description" content="${target.page.meta.metaDescription}">
  </head>
  <body>
    <main>
      <h1>${target.page.content.head.title}</h1>
      <p>${target.page.content.head.intro}</p>
    </main>
  </body>
</html>`;

  return {
    security: {
      nonce,
    },
    response: new Response(html, {
      status: target.status,
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    }),
  };
};
