// src/app/policies/response/security/apply.trusted.types.report.only.response.policy.ts

import type { ResponsePolicy } from "@app/policies/response/response.policies.types";

const buildTrustedTypesReportOnlyPolicy = (): string => {
  return ["require-trusted-types-for 'script'", "trusted-types default"].join(
    "; ",
  );
};

export const applyTrustedTypesReportOnlyResponsePolicy: ResponsePolicy = (
  _context,
  response,
): Response => {
  const headers = new Headers(response.headers);

  headers.set(
    "content-security-policy-report-only",
    buildTrustedTypesReportOnlyPolicy(),
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
