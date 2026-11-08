// src/app/life-cycle/response/rejection/rejection.response.ts

import type { RequestResult } from "../../../types/request/request.shared.type";
import { requestConfig } from "../../request/config.request";

type RejectionResult = Extract<
  RequestResult,
  { ok: false; reason: "METHOD_NOT_ALLOWED" }
>;

type Input = Readonly<{
  result: RejectionResult;
}>;

export const handleRejectionResponse = ({ result: _result }: Input): Response =>
  new Response("Method Not Allowed", {
    status: 405,
    headers: {
      Allow: requestConfig.allowedMethods.join(", "),
    },
  });
