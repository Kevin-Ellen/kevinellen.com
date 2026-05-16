// src/app-state/resolve/assets.resolve.app-state.test.ts

import { appStateResolveAssets } from "@app-state/resolve/assets.resolve.app-state";

import { AUTHORED_SCRIPT_ASSETS } from "@app-state/config/assets/authored.scripts.assets.app-state";
import { AUTHORED_SVG_ASSETS } from "@app-state/config/assets/authored.svg.assets.app-state";

jest.mock("@app-state/config/assets/authored.scripts.assets.app-state", () => ({
  AUTHORED_SCRIPT_ASSETS: [
    {
      id: "inline-script",
      kind: "inline",
      content: "  console.log('hello');  ",
      placement: "docClose",
    },
    {
      id: "linked-script",
      kind: "link",
      src: "/assets/example.js",
      placement: "docClose",
    },
  ],
}));

jest.mock("@app-state/config/assets/authored.svg.assets.app-state", () => ({
  AUTHORED_SVG_ASSETS: [
    {
      id: "icon-test",
      viewBox: "0 0 10 10",
      content: "<path />",
    },
  ],
}));

describe("appStateResolveAssets", () => {
  it("resolves authored script and SVG assets", () => {
    expect(appStateResolveAssets.svg).toEqual(AUTHORED_SVG_ASSETS);

    expect(appStateResolveAssets.scripts).toEqual(
      AUTHORED_SCRIPT_ASSETS.map((script) =>
        script.kind === "inline"
          ? {
              ...script,
              content: script.content.trim(),
            }
          : script,
      ),
    );
  });

  it("trims inline script asset content", () => {
    const inlineScripts = appStateResolveAssets.scripts.filter(
      (script) => script.kind === "inline",
    );

    inlineScripts.forEach((script) => {
      expect(script.content).toBe(script.content.trim());
    });
  });

  it("preserves non-inline script assets unchanged", () => {
    const nonInlineScripts = AUTHORED_SCRIPT_ASSETS.filter(
      (script) => script.kind !== "inline",
    );

    nonInlineScripts.forEach((script) => {
      expect(appStateResolveAssets.scripts).toContainEqual(script);
    });
  });

  it("deep freezes resolved assets", () => {
    expect(Object.isFrozen(appStateResolveAssets)).toBe(true);

    expect(Object.isFrozen(appStateResolveAssets.scripts)).toBe(true);

    expect(Object.isFrozen(appStateResolveAssets.svg)).toBe(true);
  });
});
