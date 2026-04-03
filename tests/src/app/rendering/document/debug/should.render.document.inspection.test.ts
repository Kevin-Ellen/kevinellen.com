// tests/src/app/rendering/document/debug/should.render.document.inspection.test.ts

import { shouldRenderDocumentInspection } from "@app/rendering/document/debug/should.render.document.inspection";

describe("shouldRenderDocumentInspection", () => {
  it("returns true in dev when debug=document is present", () => {
    const req = new Request("https://example.com/journal?debug=document");

    const env = {
      APP_ENV: "dev",
      APP_HOST: "kevinellen.com",
    } as Env;

    expect(shouldRenderDocumentInspection(req, env)).toBe(true);
  });

  it("returns true in staging when debug=document is present", () => {
    const req = new Request("https://example.com/journal?debug=document");

    const env = {
      APP_ENV: "stg",
      APP_HOST: "kevinellen.com",
    } as Env;

    expect(shouldRenderDocumentInspection(req, env)).toBe(true);
  });

  it("returns false when the debug query param is missing", () => {
    const req = new Request("https://example.com/journal");

    const env = {
      APP_ENV: "dev",
      APP_HOST: "kevinellen.com",
    } as Env;

    expect(shouldRenderDocumentInspection(req, env)).toBe(false);
  });

  it("returns false when the debug query param has a different value", () => {
    const req = new Request("https://example.com/journal?debug=true");

    const env = {
      APP_ENV: "dev",
      APP_HOST: "kevinellen.com",
    } as Env;

    expect(shouldRenderDocumentInspection(req, env)).toBe(false);
  });

  it("returns false in prod even when debug=document is present", () => {
    const req = new Request("https://example.com/journal?debug=document");

    const env = {
      APP_ENV: "prod",
      APP_HOST: "kevinellen.com",
    } as Env;

    expect(shouldRenderDocumentInspection(req, env)).toBe(false);
  });
});
