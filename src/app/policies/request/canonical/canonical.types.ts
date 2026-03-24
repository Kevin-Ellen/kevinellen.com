// src/app/policies/canonical/canonical.types.ts

export type CanonicalRedirectCode = 308;

export type CanonicalUrlParts = {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
};
