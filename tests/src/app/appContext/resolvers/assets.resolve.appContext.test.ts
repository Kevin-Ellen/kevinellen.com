// tests/src/app/appContext/resolvers/assets.resolve.appContext.test.ts

import { resolveAssetsAppContext } from "@app/appContext/resolvers/assets.resolve.appContext";
import { createAppState } from "@app/appState/create.appState";

import type { DocumentRenderTarget } from "@app/request/request.document.types";
import type {
  ScriptAssetConfig,
  SvgAssetConfig,
} from "@config/assets.config.types";

describe("resolveAssetsAppContext", () => {
  const appState = createAppState();

  const getFirst = <T>(items: readonly T[], label: string): T => {
    const first = items[0];

    if (!first) {
      throw new Error(`Expected at least one ${label} asset for this test`);
    }

    return first;
  };

  const createTargetWithAssets = (
    scripts: readonly ScriptAssetConfig[],
    svgs: readonly SvgAssetConfig[],
  ): DocumentRenderTarget => ({
    kind: "page",
    status: 200,
    page: {
      ...appState.getPublicPageById("home")!,
      assets: {
        scripts,
        svgs,
      },
    },
  });

  it("returns global assets when page has none", () => {
    const target = createTargetWithAssets([], []);

    const result = resolveAssetsAppContext(appState, target);

    expect(result.scripts).toEqual(appState.getAssetsConfig().scripts);
    expect(result.svgs).toEqual(appState.getAssetsConfig().svgs);
  });

  it("includes page script assets in the merged result", () => {
    const pageScript = getFirst(appState.getAssetsConfig().scripts, "script");
    const target = createTargetWithAssets([pageScript], []);

    const result = resolveAssetsAppContext(appState, target);

    expect(result.scripts).toContain(pageScript);
  });

  it("includes page svg assets in the merged result", () => {
    const pageSvg = getFirst(appState.getAssetsConfig().svgs, "svg");
    const target = createTargetWithAssets([], [pageSvg]);

    const result = resolveAssetsAppContext(appState, target);

    expect(result.svgs).toContain(pageSvg);
  });

  it("deduplicates scripts by id", () => {
    const script = getFirst(appState.getAssetsConfig().scripts, "script");
    const target = createTargetWithAssets([script], []);

    const result = resolveAssetsAppContext(appState, target);

    const matchingScripts = result.scripts.filter(
      (candidate) => candidate.id === script.id,
    );

    expect(matchingScripts).toHaveLength(1);
  });

  it("deduplicates svgs by id", () => {
    const svg = getFirst(appState.getAssetsConfig().svgs, "svg");
    const target = createTargetWithAssets([], [svg]);

    const result = resolveAssetsAppContext(appState, target);

    const matchingSvgs = result.svgs.filter(
      (candidate) => candidate.id === svg.id,
    );

    expect(matchingSvgs).toHaveLength(1);
  });

  it("lets page script asset win when the same id appears in both global and page assets", () => {
    const globalScript = getFirst(appState.getAssetsConfig().scripts, "script");

    const pageScript = {
      ...globalScript,
    };

    const target = createTargetWithAssets([pageScript], []);

    const result = resolveAssetsAppContext(appState, target);

    const found = result.scripts.find(
      (candidate) => candidate.id === globalScript.id,
    );

    expect(found).toBe(pageScript);
  });

  it("lets page svg asset win when the same id appears in both global and page assets", () => {
    const globalSvg = getFirst(appState.getAssetsConfig().svgs, "svg");

    const pageSvg = {
      ...globalSvg,
    };

    const target = createTargetWithAssets([], [pageSvg]);

    const result = resolveAssetsAppContext(appState, target);

    const found = result.svgs.find(
      (candidate) => candidate.id === globalSvg.id,
    );

    expect(found).toBe(pageSvg);
  });
});
