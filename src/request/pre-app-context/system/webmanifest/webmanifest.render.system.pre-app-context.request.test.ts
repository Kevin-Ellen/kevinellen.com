// src/request/pre-app-context/system/webmanifest/webmanifest.render.system.pre-app-context.request.test.ts

import { renderWebmanifestSystem } from "@request/pre-app-context/system/webmanifest/webmanifest.render.system.pre-app-context.request";

const expectDirectResponse = (
  result: ReturnType<typeof renderWebmanifestSystem>,
): Response => {
  expect(result.kind).toBe("direct-response");

  if (result.kind !== "direct-response") {
    throw new Error("Expected direct-response result.");
  }

  return result.response;
};

describe("renderWebmanifestSystem", () => {
  it("renders the webmanifest as formatted JSON", async () => {
    const manifest = {
      name: "Kevin Ellen",
      short_name: "Kevin",
      start_url: "/",
      display: "standalone",
    };

    const result = renderWebmanifestSystem(manifest as never);
    const response = expectDirectResponse(result);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "application/manifest+json; charset=utf-8",
    );

    await expect(response.text()).resolves.toBe(
      JSON.stringify(manifest, null, 2),
    );
  });
});
