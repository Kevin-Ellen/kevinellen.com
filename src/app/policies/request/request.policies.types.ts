// src/app/policies/request/request.policies.types.ts

export type RequestPolicyOutcome =
  | { kind: "continue" }
  | { kind: "direct-response"; response: Response };
