// src/app/entry.type.ts

export type ValidatedEnv = Env &
  Readonly<{
    CONTENT_KV: KVNamespace;
    PHOTO_KV: KVNamespace;
  }>;
