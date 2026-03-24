// src/app/policies/response/response.policies.types.ts

import type { AppContext } from "@app/appContext/appContext";

export type ResponsePolicyContext = {
  response: Response;
  appContext: AppContext;
};
