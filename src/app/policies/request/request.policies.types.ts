// src/app/policies/request/request.policies.types.ts

export type RequestPolicyOutcome =
  | {
      type: "continue";
    }
  | {
      type: "direct-response";
      response: Response;
    };
