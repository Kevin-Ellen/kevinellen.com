// src/app/response/handler.response.ts

import type { AppState } from "@app/appState/appState";

export const handleResponse = (
  _req: Request,
  _env: Env,
  _ctx: ExecutionContext,
  _appState: AppState,
  response: Response,
): Response => {
  return response;
};
