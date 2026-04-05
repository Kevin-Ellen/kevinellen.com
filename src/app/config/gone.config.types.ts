// src/config/gone.config.types.ts

export type GoneRule = {
  readonly path: string;
};

export type GoneConfig = readonly GoneRule[];
