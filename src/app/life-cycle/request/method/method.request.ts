// src/app/life-cycle/request/method/method.request.ts

import type { RequestResult } from "../../../types/request/request.shared.type";
import type { RequestConfig } from "../config.request";

type Input = Readonly<{
  request: Request;
  allowedMethods: RequestConfig["allowedMethods"];
}>;

type MethodRejection = Extract<
  RequestResult,
  { ok: false; reason: "METHOD_NOT_ALLOWED" }
>;

export const validateMethod = ({
  request,
  allowedMethods,
}: Input): MethodRejection | null => {
  if (allowedMethods.includes(request.method)) {
    return null;
  }

  return {
    ok: false,
    reason: "METHOD_NOT_ALLOWED",
  };
};
