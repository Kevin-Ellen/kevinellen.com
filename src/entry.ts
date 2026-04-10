// src/entry.ts

import { createAppState } from "@app/appState/create.appState";
import { requestHandler } from "@app/handlers/request.handler";
import { assetHandler } from "@app/handlers/asset.handler";
import { photoHandler } from "@app/handlers/photo.handler";

const isAssetRequest = (pathname: string): boolean => {
  return (
    pathname.startsWith("/assets/") ||
    pathname === "/favicon.ico" ||
    pathname === "/apple-touch-icon.png"
  );
};

export const onRequest = async (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> => {
  const url = new URL(req.url);

  if (isAssetRequest(url.pathname)) {
    const assetResponse = await assetHandler(req, env, ctx);

    if (assetResponse) {
      return assetResponse;
    }
  }

  if (url.pathname.startsWith("/photo/")) {
    const photoResponse = await photoHandler(env, url.pathname);

    if (photoResponse) {
      return photoResponse;
    }
  }

  const appState = await createAppState(env);

  return requestHandler(req, env, ctx, appState);
};

export default {
  fetch: onRequest,
};
