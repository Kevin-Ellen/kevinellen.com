// src/app/runtime/runtime.types

export type RuntimeBehaviour = {
  appEnv: Env["APP_ENV"];
  canonicalRedirect: boolean;
  indexing: boolean;
  public: boolean;
  canonicalHost: string | null;
};
