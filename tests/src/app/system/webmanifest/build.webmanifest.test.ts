// tests/src/app/system/webmanifest/build.webmanifest.test.ts

import type { AppState } from "@app/appState/appState";

import { buildWebManifest } from "@app/system/webmanifest/build.webmanifest";

describe("buildWebManifest", () => {
  const createAppState = (
    overrides?: Partial<ReturnType<AppState["getWebManifestConfig"]>>,
  ): AppState =>
    ({
      getWebManifestConfig: jest.fn(() => ({
        name: "Kevin Ellen",
        shortName: "Kevin Ellen",
        description:
          "Wildlife photography, field notes, and technical work exploring nature and digital publishing.",
        themeColor: "#1f2621",
        backgroundColor: "#1f2621",
        display: "standalone",
        ...overrides,
      })),
    }) as unknown as AppState;

  it("builds the manifest from webmanifest config", () => {
    const appState = createAppState();

    const result = buildWebManifest(appState);

    expect(result).toEqual({
      name: "Kevin Ellen",
      shortName: "Kevin Ellen",
      description:
        "Wildlife photography, field notes, and technical work exploring nature and digital publishing.",
      startUrl: "/",
      display: "standalone",
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
  });

  it("reads webmanifest config once", () => {
    const appState = createAppState();

    buildWebManifest(appState);

    expect(appState.getWebManifestConfig).toHaveBeenCalledTimes(1);
  });

  it("preserves allowed display values from config", () => {
    const appState = createAppState({
      display: "minimal-ui",
      shortName: "Kevin",
      description: "Test description",
      themeColor: "#000000",
      backgroundColor: "#ffffff",
    });

    const result = buildWebManifest(appState);

    expect(result.display).toBe("minimal-ui");
  });

  it("preserves configured manifest fields without rewriting them", () => {
    const appState = createAppState({
      name: "Photography Duck",
      shortName: "Duck",
      description: "Nature notes and photographs.",
      themeColor: "#112233",
      backgroundColor: "#445566",
    });

    const result = buildWebManifest(appState);

    expect(result.name).toBe("Photography Duck");
    expect(result.shortName).toBe("Duck");
    expect(result.description).toBe("Nature notes and photographs.");
    expect(result.themeColor).toBe("#112233");
    expect(result.backgroundColor).toBe("#445566");
  });

  it("always includes the default icon set", () => {
    const appState = createAppState();

    const result = buildWebManifest(appState);

    expect(result.icons).toEqual([
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
});
