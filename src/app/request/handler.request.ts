// src/app/request/requestHandler.ts

import type { AppState } from "@app/appState/appState";
import { routeRequest } from "@app/request/router.request";

export const handleRequest = async (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
  appState: AppState,
): Promise<Response> => {
  const url = new URL(req.url);
  const slug = url.pathname;

  try {
    const result = routeRequest(slug, appState);

    if (result.kind === "not-found") {
      const errorPage = appState.getErrorPageByStatus(404);

      return new Response(JSON.stringify(errorPage, null, 2), {
        status: 404,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }

    return new Response(JSON.stringify(result.page, null, 2), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  } catch (_error) {
    const errorPage = appState.getErrorPageByStatus(500);

    return new Response(JSON.stringify(errorPage, null, 2), {
      status: 500,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }
};
