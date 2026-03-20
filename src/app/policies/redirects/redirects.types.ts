// src/app/policies/redirects/redirects.types.ts

export type PermanentRedirect = 301 | 308;
export type TemporaryRedirect = 302 | 307;

export type RedirectCode = TemporaryRedirect | PermanentRedirect;

/**
 * A deterministic redirect rule evaluated during the pre-routing policy stage.
 *
 * Rules are evaluated before routing and may terminate the request lifecycle
 * with a direct redirect response.
 *
 * Redirect semantics:
 *
 * 301 — Permanent content migration
 * 302 — Temporary content redirect
 * 307 — Temporary strict (method-preserving)
 * 308 — Permanent strict (method-preserving)
 */
export type RedirectRule = {
  fromPath: string;
  toPath: string;
  status: RedirectCode;
};

export type RedirectRules = readonly RedirectRule[];
