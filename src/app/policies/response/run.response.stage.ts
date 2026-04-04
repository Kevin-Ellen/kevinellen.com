// src/app/policies/response/run.response.stage.ts

import type {
  ResponsePolicy,
  ResponsePolicyContext,
} from "@app/policies/response/response.policies.types";

export const runResponseStage = (
  context: ResponsePolicyContext,
  response: Response,
  policies: readonly ResponsePolicy[],
): Response => {
  return policies.reduce(
    (nextResponse, policy) => policy(context, nextResponse),
    response,
  );
};
