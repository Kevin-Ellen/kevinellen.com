// src/request/pre-request/guard/method/method.guard.pre-request.request.ts

const ALLOWED_METHODS = ["GET", "HEAD"] as const;
const ALLOWED_METHOD_SET = new Set<string>(ALLOWED_METHODS);
const ALLOW_HEADER_VALUE = ALLOWED_METHODS.join(", ");

export const evaluateMethodGuardPreRequest = (
  req: Request,
): Response | null => {
  if (ALLOWED_METHOD_SET.has(req.method)) {
    return null;
  }

  return new Response(null, {
    status: 405,
    headers: {
      allow: ALLOW_HEADER_VALUE,
      "x-runtime-policy": "method",
    },
  });
};
