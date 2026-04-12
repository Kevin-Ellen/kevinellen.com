// shared-types/config/system/gone-rules.system.types.ts

export type GoneRule = {
  readonly path: string;
};

export type GoneRules = readonly GoneRule[];
