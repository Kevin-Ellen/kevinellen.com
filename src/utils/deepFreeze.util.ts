// src/utils/deepFreeze.util.ts

export function deepFreeze<T>(obj: T): T {
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return obj;
  }

  for (const key of Object.getOwnPropertyNames(obj)) {
    const value = (obj as Record<string, unknown>)[key];

    if (
      value !== null &&
      (typeof value === "object" || typeof value === "function") &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
}
