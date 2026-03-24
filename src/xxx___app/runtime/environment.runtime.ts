// src/app/runtime/environment.runtime.ts

export const isProductionEnvironment = (env: Env): boolean =>
  env.APP_ENV === "prod";

export const isNonProductionEnvironment = (env: Env): boolean =>
  env.APP_ENV !== "prod";
