// src/app/life-cycle/response/rejection/rejection.response.test.ts

import { requestConfig } from "../../request/config.request";
import { handleRejectionResponse } from "./rejection.response";

describe("Rejection response", () => {
  type RejectionInput = Parameters<typeof handleRejectionResponse>[0]["result"];

  const result = {
    ok: false,
    reason: "METHOD_NOT_ALLOWED",
  } as RejectionInput;

  it("returns HTTP 405", () => {
    const response = handleRejectionResponse({ result });

    expect(response.status).toBe(405);
    expect(response.ok).toBe(false);
  });

  it("returns the method not allowed message", async () => {
    const response = handleRejectionResponse({ result });

    expect(await response.text()).toBe("Method Not Allowed");
  });

  it("sets Allow using configured methods", () => {
    const response = handleRejectionResponse({ result });

    expect(response.headers.get("Allow")).toBe(
      requestConfig.allowedMethods.join(", "),
    );
  });

  it("does not include a Location header", () => {
    const response = handleRejectionResponse({ result });

    expect(response.headers.has("Location")).toBe(false);
  });
});
