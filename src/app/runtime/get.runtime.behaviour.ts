// src/app/runtime/get.runtime.behaviour

import type { RuntimeBehaviour } from "@app/runtime/runtime.types";

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

export const getRuntimeBehaviour = (env: Env): RuntimeBehaviour => {
  const behaviour = RUNTIME_BEHAVIOUR[env.APP_ENV];

  return {
    appEnv: env.APP_ENV,
    canonical: behaviour.canonical,
    indexing: behaviour.indexing,
    public: behaviour.public,
    canonicalHost: env.APP_HOST ?? null,
  };
};
