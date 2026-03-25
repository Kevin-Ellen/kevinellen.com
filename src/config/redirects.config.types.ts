// src/config/redirects.config.types.ts

type TemporaryRedirectStatusCode = 302 | 307;
type PermanentRedirectStatusCode = 301 | 308;

export type RedirectStatusCode =
  | TemporaryRedirectStatusCode
  | PermanentRedirectStatusCode;

export type RedirectRule = {
  readonly fromPath: string;
  readonly to: string;
  readonly redirectStatusCode: RedirectStatusCode;
};
