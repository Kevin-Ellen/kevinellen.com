// src/request/pre-request/guard/guard.pre-request.request.ts

import { evaluateMethodGuardPreRequest } from "@request/pre-request/guard/method/method.guard.pre-request.request";

export const orchestrateGuardPreRequest = (req: Request): Response | null => {
  const methodGuardResponse = evaluateMethodGuardPreRequest(req);

  if (methodGuardResponse) {
    return methodGuardResponse;
  }

  return null;
};
