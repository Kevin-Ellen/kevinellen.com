// src/app/runtime/get.runtime.behaviour.ts

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

type RuntimeAppEnv = keyof typeof RUNTIME_BEHAVIOUR;

const isRuntimeAppEnv = (value: string | undefined): value is RuntimeAppEnv => {
  return value === "dev" || value === "stg" || value === "prod";
};

export const getRuntimeBehaviour = (env: Env): RuntimeBehaviour => {
  const appEnv = env.APP_ENV;

  if (!isRuntimeAppEnv(appEnv)) {
    throw new Error(
      `Invalid or missing APP_ENV runtime variable: ${String(appEnv)}`,
    );
  }

  const behaviour = RUNTIME_BEHAVIOUR[appEnv];

  return {
    appEnv,
    canonical: behaviour.canonical,
    indexing: behaviour.indexing,
    public: behaviour.public,
    canonicalHost: env.APP_HOST ?? null,
  };
};
