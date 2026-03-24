// src/app/request/request.types.ts

export type ErrorRenderIntent =
  | { kind: "not-found" }
  | { kind: "gone" }
  | { kind: "internal-error" };
