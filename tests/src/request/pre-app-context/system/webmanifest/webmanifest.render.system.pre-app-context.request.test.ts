// tests/src/request/pre-app-context/system/webmanifest/webmanifest.render.system.pre-app-context.request.test.ts

import { renderWebmanifestSystem } from "@request/pre-app-context/system/webmanifest/webmanifest.render.system.pre-app-context.request";

describe("renderWebmanifestSystem", () => {
  it("returns a direct-response with correct headers and body", async () => {
    const manifest = {
      name: "Kevin Ellen",
      short_name: "KE",
      start_url: "/",
    };

    const result = renderWebmanifestSystem(manifest as any);

    expect(result.kind).toBe("direct-response");

    if (result.kind !== "direct-response") {
      throw new Error("Expected direct-response");
    }

    expect(result.response.status).toBe(200);
    expect(result.response.headers.get("content-type")).toBe(
      "application/manifest+json; charset=utf-8",
    );

    const body = await result.response.text();

    expect(body).toBe(JSON.stringify(manifest, null, 2));
  });
});
