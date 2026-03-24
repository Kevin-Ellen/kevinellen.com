// tests/src/app/system/webmanifest/render.webmanifest.test.ts

import { renderWebManifest } from "@app/system/webmanifest/render.webmanifest";

describe("renderWebManifest", () => {
  const createManifest = () => ({
    name: "Kevin Ellen",
    shortName: "Kevin",
    description: "Wildlife photography and technical work.",
    startUrl: "/",
    display: "standalone" as const,
    backgroundColor: "#1f2621",
    themeColor: "#1f2621",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  });

  it("renders valid JSON", () => {
    const result = renderWebManifest(createManifest());

    expect(() => JSON.parse(result)).not.toThrow();
  });

  it("renders the expected manifest fields", () => {
    const result = renderWebManifest(createManifest());

    expect(JSON.parse(result)).toEqual(createManifest());
  });

  it("preserves multiple icons in the rendered output", () => {
    const result = renderWebManifest(createManifest());
    const parsed = JSON.parse(result);

    expect(parsed.icons).toEqual([
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ]);
  });

  it("renders formatted JSON with indentation", () => {
    const result = renderWebManifest({
      ...createManifest(),
      icons: [],
    });

    expect(result).toContain('\n  "name": "Kevin Ellen"');
  });
});
