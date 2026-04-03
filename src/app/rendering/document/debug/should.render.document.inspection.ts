// src/app/rendering/debug/should.render.document.inspection.ts

import { getRuntimeBehaviour } from "@app/runtime/get.runtime.behaviour";

export const shouldRenderDocumentInspection = (
  req: Request,
  env: Env,
): boolean => {
  const runtimeBehaviour = getRuntimeBehaviour(env);

  if (runtimeBehaviour.appEnv === "prod") {
    return false;
  }

  const url = new URL(req.url);
  const debug = url.searchParams.get("debug");

  return debug === "document";
};
