// src/app/entry.type.ts

export type DeploymentEnvironment = "development" | "staging" | "production";

export type WorkerEnv = Readonly<{
  CONTENT_KV: KVNamespace;
  PHOTO_KV: KVNamespace;
  ASSETS: Fetcher;
  DOMAIN: string;
  INSPECT_ENABLED: string;
  IMAGES_ACCOUNT_HASH: string;
  DEPLOYMENT_ENVIRONMENT: string;
}>;

export type ValidatedEnv = WorkerEnv &
  Readonly<{
    DEPLOYMENT_ENVIRONMENT: DeploymentEnvironment;
  }>;
