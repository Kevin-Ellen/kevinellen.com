// src/app/policies/request/system/request.system.types.ts

export type RequestSystemStageContinueOutcome = {
  kind: "continue";
};

export type RequestSystemStageDirectResponseOutcome = {
  kind: "direct-response";
  response: Response;
};

export type SystemOutcome =
  | RequestSystemStageContinueOutcome
  | RequestSystemStageDirectResponseOutcome;
