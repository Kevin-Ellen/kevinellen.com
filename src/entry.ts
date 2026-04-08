import { createAppState } from "@app/appState/create.appState";
import { requestHandler } from "@app/handlers/request.handler";
import { assetHandler } from "@app/handlers/asset.handler";

export const onRequest = async (
  req: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> => {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/assets/")) {
    return assetHandler(req, env, ctx);
  }

  const appState = createAppState();

  return requestHandler(req, env, ctx, appState);
};

export default {
  fetch: onRequest,
};
