// src/app/entry.type.ts

export type WorkerEnv = Readonly<{
  CONTENT_KV: KVNamespace;
  PHOTO_KV: KVNamespace;
  ASSETS: Fetcher;
  DOMAIN: string;
  INSPECT_ENABLED: string;
  IMAGES_ACCOUNT_HASH: string;
}>;

export type ValidatedEnv = WorkerEnv;
