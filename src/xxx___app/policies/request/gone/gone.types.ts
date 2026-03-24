// src/app/policies/request/gone/gone.types.ts

/**
 * Explicit request paths that are intentionally resolved as gone (410)
 * during the pre-routing policy stage.
 *
 * These paths:
 * - are evaluated before routing
 * - bypass normal route resolution
 * - produce a rendered gone intent rather than a route miss
 * - must be deterministic and side-effect free
 */
export type GonePath = string;

export type GoneRules = readonly GonePath[];
