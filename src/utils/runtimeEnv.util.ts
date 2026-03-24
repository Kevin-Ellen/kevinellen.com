// src/utils/runtimeEnv.util.ts

const RUNTIME_BEHAVIOUR = {
  dev: {
    canonical: false,
    indexing: false,
    public: false,
  },
  stg: {
    canonical: true,
    indexing: false,
    public: true,
  },
  prod: {
    canonical: true,
    indexing: true,
    public: true,
  },
} as const;

export const getRuntimeBehaviour = (env: Env) => RUNTIME_BEHAVIOUR[env.APP_ENV];
