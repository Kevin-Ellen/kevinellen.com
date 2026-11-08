// src/app/life-cycle/request/method/method.request.test.ts

import type { RequestConfig } from "../config.request";

import { validateMethod } from "./method.request";

describe("Request method validation", () => {
  const allowedMethods: RequestConfig["allowedMethods"] = ["GET", "HEAD"];

  const validate = (
    method: string,
    allowed: RequestConfig["allowedMethods"] = allowedMethods,
  ) =>
    validateMethod({
      request: new Request("https://kevinellen.com/", {
        method,
      }),
      allowedMethods: allowed,
    });

  describe("Allowed methods", () => {
    it.each(["GET", "HEAD"])("accepts %s requests", (method) => {
      expect(validate(method)).toBeNull();
    });

    it("accepts explicitly configured methods", () => {
      expect(validate("POST", ["POST"])).toBeNull();
    });
  });

  describe("Rejected methods", () => {
    it.each(["POST", "PUT", "PATCH", "DELETE"])(
      "rejects %s requests",
      (method) => {
        expect(validate(method)).toEqual({
          ok: false,
          reason: "METHOD_NOT_ALLOWED",
        });
      },
    );

    it("rejects methods when no methods are allowed", () => {
      expect(validate("GET", [])).toEqual({
        ok: false,
        reason: "METHOD_NOT_ALLOWED",
      });
    });

    it("uses case-sensitive method matching", () => {
      expect(validate("GET", ["get"])).toEqual({
        ok: false,
        reason: "METHOD_NOT_ALLOWED",
      });
    });

    it("respects a restricted method configuration", () => {
      expect(validate("HEAD", ["GET"])).toEqual({
        ok: false,
        reason: "METHOD_NOT_ALLOWED",
      });
    });
  });
});
