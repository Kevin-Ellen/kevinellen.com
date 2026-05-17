// shared-types/config/system/redirect-rules.system.types.ts

type RedirectRulesTemporaryRedirectStatusCode = 302 | 307;
type RedirectRulesPermanentRedirectStatusCode = 301 | 308;

export type SystemRedirectStatusCode =
  | RedirectRulesTemporaryRedirectStatusCode
  | RedirectRulesPermanentRedirectStatusCode;

export type SystemRedirectRule = Readonly<{
  fromPath: string;
  to: string;
  redirectStatusCode: SystemRedirectStatusCode;
}>;
